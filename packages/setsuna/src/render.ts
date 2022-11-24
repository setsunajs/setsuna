import { def } from "@setsunajs/shared"
import { error } from "./handler/errorHandler"
import { isVNode } from "./jsx"
import { patch } from "./patch/patch"
import { unmount } from "./patch/unmount"
import { SeElement, VNode } from "./runtime.type"

const rootFlag = "__se_container__"

export function createRoot(container: HTMLElement) {
  if (!(container instanceof HTMLElement)) {
    throw error("render", "container is not a DOM node")
  }

  if ((container as any)[rootFlag] !== rootFlag) {
    throw error(
      "render",
      "container has been created, please unmount app first"
    )
  }

  def(container, rootFlag, rootFlag)

  let renderNode: VNode
  return {
    mount: (node: VNode | SeElement<any, any>) => {
      if (!isVNode(node)) {
        return error("render", "VNode is invalid")
      }

      render((renderNode = node), container)
    },
    hydrate: (node: VNode | SeElement<any, any>) => {
      if (!isVNode(node)) {
        return error("render", "VNode is invalid")
      }

      hydrate((renderNode = node), container)
    },
    unmount: () => {
      if (renderNode) {
        unmount(renderNode)
      }

      ;(container as any)[rootFlag] = undefined
    }
  }
}

export function render(VNode: VNode | SeElement<any, any>, container: Node) {
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

export function hydrate(VNode: VNode | SeElement<any, any>, container: Node) {
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
