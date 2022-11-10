import { dom } from "../../../dom"
import { PatchContext, VNode } from "../../../runtime.type"
import { patchChildren } from "../../patchChildren"

export function updateFragment(context: PatchContext) {
  const node = context.newVNode!
  const oldVNode = context.oldVNode!
  const { container, ...rest } = context
  patchChildren(node.children as VNode[], oldVNode.children as VNode[], {
    ...rest,
    container: container ?? oldVNode.el
  })
  if (node.children.length > 0) {
    node.el = (node.children[0] as VNode).el
    node.anchor = dom.getNextSiblingNode(node.children.at(-1) as VNode)
  } else {
    node.el = node.anchor = null
  }
}
