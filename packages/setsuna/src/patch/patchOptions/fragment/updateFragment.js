import { getElementNextSibling } from "../../../node/nodeOpts"
import { patchChildren } from "../../patchChildren"

export function updateFragment(context) {
  const { oldVNode, newVNode, container, ...rest } = context
  patchChildren(oldVNode.children, newVNode.children, {
    ...rest,
    container: container ?? oldVNode.el
  })
  newVNode.el = newVNode.children[0].el
  newVNode.anchor = getElementNextSibling(newVNode.children.at(-1))
}
