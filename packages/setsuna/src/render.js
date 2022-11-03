import { error } from "./handler/errorHandler"
import { patch } from "./patch/patch"

export function render(VNode, container) {
  if (!(container instanceof HTMLElement)) {
    return error("render", "container is not a DOM node")
  }

  patch({
    oldVNode: null,
    newVNode: VNode,
    container,
    anchor: null,
    parentComponent: null,
    deep: false,
    hydrate: false
  })
}

export function hydrate(VNode, container) {
  if (!(container instanceof HTMLElement)) {
    return hydrate("render", "container is not a DOM node")
  }

  patch({
    oldVNode: null,
    newVNode: VNode,
    container,
    anchor: null,
    parentComponent: null,
    deep: false,
    hydrate: true,
    hydrateNode: null
  })
}
