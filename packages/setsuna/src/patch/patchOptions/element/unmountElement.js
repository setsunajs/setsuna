import { removeElement } from "../../../node/nodeOpts"
import { patchProps } from "../../patchProps"
import { unmount } from "../../unmount"

export function unmountELement(node) {
  const { _e: e } = node
  const { el, attrs, ref } = e

  e.children.forEach(unmount)

  if (!el) {
    // hmr. el is null/undefined
    return
  }

  if (ref) {
    ref.complete()
  }

  patchProps(el, {}, attrs)
  removeElement(el)
  node.el = e.el = null
}
