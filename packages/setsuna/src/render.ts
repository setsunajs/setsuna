import { def } from "@setsunajs/shared"
import { error } from "./handler/errorHandler"
import { patch } from "./patch/patch"
import { SeElement, VNode } from "./runtime.type"

const rootFlag = "__se_container__"

export function createRoot(container: HTMLElement) {
  if (!(container instanceof HTMLElement)) {
    throw error("render", "container is not a DOM node")
  }

  if (rootFlag in container) {
    throw error(
      "render",
      "container has been created, please unmount app first"
    )
  }

  def(container, rootFlag, true)

  return {
    mount: (node: VNode | SeElement<any, any>) =>
      render(node, container),
    hydrate: (node: VNode | SeElement<any, any>) =>
      hydrate(node, container)
  }
}

export function render(
  VNode: VNode | SeElement<any, any>,
  container: Node
) {
  patch({
    oldVNode: null,
    newVNode: VNode as VNode,
    container,
    anchor: null,
    parentComponent: null,
    deep: false,
    hydrate: false
  })
}

export function hydrate(
  VNode: VNode | SeElement<any, any>,
  container: Node
) {
  patch({
    oldVNode: null,
    newVNode: VNode as VNode,
    container,
    anchor: null,
    parentComponent: null,
    deep: false,
    hydrate: true,
    hydrateNode: null
  })
}
