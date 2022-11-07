import { def } from "@setsunajs/shared"
import Setsuna from "../jsx"
import { error } from "./handler/errorHandler"
import { VNode } from "./jsx"
import { patch } from "./patch/patch"

const rootFlag = "__se_container__"

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

  def(container, rootFlag, true)

  return {
    mount: (node: VNode | Setsuna.SeElement<any, any>) =>
      render(node, container),
    hydrate: (node: VNode | Setsuna.SeElement<any, any>) =>
      hydrate(node, container)
  }
}

export function render(
  VNode: VNode | Setsuna.SeElement<any, any>,
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
  VNode: VNode | Setsuna.SeElement<any, any>,
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
