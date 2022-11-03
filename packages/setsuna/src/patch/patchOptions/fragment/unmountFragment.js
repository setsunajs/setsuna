import { unmount } from "../../unmount"

export function unmountFragment(node) {
  node.children.forEach(unmount)
  node.el = node.anchor = null
}
