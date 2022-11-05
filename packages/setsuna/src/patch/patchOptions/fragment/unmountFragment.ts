import { VNode } from "./../../../jsx"
import { unmount } from "../../unmount"

export function unmountFragment(node: VNode) {
  node.children.forEach(unmount)
  node.el = node.anchor = null
}
