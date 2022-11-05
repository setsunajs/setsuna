import { def } from "@setsunajs/shared"
import { error } from "./handler/errorHandler"
import { SeElement, VNode } from "./jsx"
import { patch } from "./patch/patch"

const rootFlag = "__se_container"

export function createApp(container: HTMLElement) {
  if (!(container instanceof HTMLElement)) {
    throw error("render", "container is not a DOM node")
  }

  if (rootFlag in container) {
    throw error(
      "render",
      "container has been created, please unmount app first"
    )
  }

  def(container, "__se_container", true)

  return {
    mount: (node: VNode | SeElement) => render(node, container),
    hydrate: (node: VNode | SeElement) => hydrate(node, container)
  }
}

export function render(VNode: VNode | SeElement, container: Node) {
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

export function hydrate(VNode: VNode | SeElement, container: Node) {
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
