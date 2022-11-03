import { getNextSibling } from "../../../node/nodeOpts"
import { mountChildren } from "../../patchChildren"

export function mountFragment(context) {
  const { newVNode: node } = context
  mountChildren(node.children, context)
  node.el = node.children[0]?.el
  node.anchor = getNextSibling(node.children.at(-1))
}
