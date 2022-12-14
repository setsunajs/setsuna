import { PatchContext, VNode } from "../../../runtime.type"
import { mountChildren } from "../../patchChildren"
import { dom } from "../../../dom"

export function mountFragment(context: PatchContext) {
  const node = context.newVNode!
  mountChildren(node.children as VNode[], context)
  if (node.children.length > 0) {
    node.el = (node.children[0] as VNode).el ?? null
    node.anchor = dom.getNextSiblingNode(node.children.at(-1) as VNode)
  } else {
    node.el = node.anchor = null
  }
}
