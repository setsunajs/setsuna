import { patch } from "./patch/patch"
import { jsx } from "./jsx"
import { isFunction } from "@setsunajs/shared"
import { isWebComponent } from "./components/WebComponent"
import { RenderComponentEffect, VNode } from "./runtime.type"

if (!globalThis?.window?.__SETSUNA_HMR_MAP__) {
  globalThis.window.__SETSUNA_HMR_MAP__ = {
    invokeReload
  }
}

const records = new Map<string, Set<RenderComponentEffect>>()

export function registryRecord(
  id: string,
  renderEffect: RenderComponentEffect
) {
  if (!id) return
  let record = records.get(id)
  if (!record) records.set(id, (record = new Set()))
  record.add(renderEffect)
}

export function invokeReload(App: any) {
  if (!isFunction(App) || App[isWebComponent]) {
    return
  }

  const appRecord = records.get(App.hmrId)
  if (!appRecord) return

  const deps = [...appRecord]
  appRecord.clear()

  deps.forEach(renderEffect => {
    const { c, active } = renderEffect
    if (!active) return

    const { VNode, parentComponent, container } = c
    const newVNode = jsx(App, VNode.props, ...VNode.children) as VNode

    patch({
      oldVNode: VNode,
      newVNode,
      container,
      anchor: VNode.anchor,
      parentComponent,
      deep: false,
      hydrate: false
    })

    Object.assign(VNode, newVNode)
    c.VNode = VNode
  })
}
