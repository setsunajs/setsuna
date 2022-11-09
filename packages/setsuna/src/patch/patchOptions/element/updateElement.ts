import { ElementNode, PatchContext, VNode } from "../../../runtime.type"
import { patchChildren } from "../../patchChildren"
import { patchProps } from "../../patchProps"
import { normalizeElementNode } from "./normalizeElementNode"

export function updateElement(context: PatchContext) {
  const node = context.newVNode!
  const oldVNode = context.oldVNode!
  const on: ElementNode = oldVNode._n
  const n = normalizeElementNode(node, false)

  n.el = on.el
  patchProps(n.el as Element, n.attrs, on.attrs)
  patchChildren(n.children as VNode[], on.children as VNode[], {
    ...context,
    newVNode: null,
    oldVNode: null,
    container: n.el!
  })
  node.el = oldVNode.el
}
