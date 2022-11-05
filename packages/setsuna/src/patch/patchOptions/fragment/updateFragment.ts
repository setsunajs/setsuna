import { VNode } from "./../../../jsx"
import { dom } from "../../../dom"
import { PatchContext } from "../../patch"
import { patchChildren } from "../../patchChildren"

export function updateFragment(context: PatchContext) {
  const { container, ...rest } = context
  const node = context.newVNode!
  const oldVNode = context.oldVNode!
  patchChildren(oldVNode.children, node.children, {
    ...rest,
    container: container ?? oldVNode.el
  })
  node.el = (node.children[0] as VNode).el
  node.anchor = dom.getNextSiblingNode(
    node.children.slice(-1)[0] as VNode
  )
}
