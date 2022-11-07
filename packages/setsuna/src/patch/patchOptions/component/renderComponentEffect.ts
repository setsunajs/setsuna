import { VNode } from "./../../../jsx"
import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { appendJob, postQueue } from "../../../scheduler"
import { isFunction } from "@setsunajs/shared"
import { patch, PatchContext } from "../../patch"
import { setCurrentInstance } from "./currentInstance"
import { dom } from "../../../dom"
import { ComponentNode } from "../patchNodeTypes"

type RenderCompEffectOptions = {
  c: ComponentNode
  anchor: VNode["anchor"]
  deep: boolean
  active: boolean
  hydrate: PatchContext["hydrate"]
  hydrateNode: PatchContext["hydrateNode"]
}

export type RenderComponentEffect = { (): any } & RenderCompEffectOptions

export function createRenderComponentEffect(
  options: RenderCompEffectOptions | null
) {
  function renderComponentEffect() {
    const { c, anchor, deep } = renderComponentEffect as RenderComponentEffect
    let { hydrateNode, hydrate } =
      renderComponentEffect as RenderComponentEffect
    const {
      render,
      mounted,
      updates,
      subTree: preSubTree,
      container,
      deps,
      mounts,
      VNode
    } = c

    setCurrentInstance(c)
    const nextSubTree = callWithErrorHandler(VNode, render!)
    setCurrentInstance(null)

    if (mounted) {
      const updated: ((...args: any[]) => any)[] = []
      updates.forEach(updateFn => {
        const fn = callWithErrorHandler(VNode, updateFn)
        if (isFunction(fn)) {
          updated.push(fn)
        }
      })
      updated.length > 0 && postQueue.push({ VNode, fns: updated })

      patch({
        oldVNode: preSubTree,
        newVNode: (c.subTree = nextSubTree),
        container: container,
        anchor,
        parentComponent: c,
        deep
      })

      const invalid: RenderComponentEffect[] = []
      deps.forEach(u => (u.active ? appendJob(u) : invalid.push(u)))
      invalid.forEach(u => deps.delete(u))

      VNode.el = nextSubTree ? nextSubTree.el : null
    } else {
      let nextNode = hydrateNode

      if (nextSubTree !== null) {
        nextNode = patch({
          oldVNode: null,
          newVNode: (c.subTree = nextSubTree),
          container,
          anchor,
          parentComponent: c,
          deep,
          hydrate,
          hydrateNode
        })
      }

      VNode.el = nextSubTree?.el
      VNode.anchor = nextSubTree ? dom.getNextSibling(nextSubTree) : null
      Object.assign(c, {
        mounted: true,
        unmounts: mounts.map(fn => callWithErrorHandler(VNode, fn))
      })
      Object.assign(renderComponentEffect, {
        hydrate: false,
        hydrateNode: null
      })

      return nextNode
    }
  }

  Object.assign(renderComponentEffect, options)
  options = null
  return renderComponentEffect as any as RenderComponentEffect
}
