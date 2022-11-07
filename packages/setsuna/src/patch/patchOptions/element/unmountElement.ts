import { VNode } from "./../../../jsx"
import { dom } from "../../../dom"
import { patchProps } from "../../patchProps"
import { unmount } from "../../unmount"

export function unmountELement(node: VNode) {
  const { _n: n } = node
  const { el, attrs, ref } = n

  n.children.forEach(unmount)

  if (!el) return // hmr. el is null/undefined

  if (ref) {
    n.ref = null
    ref.complete()
  }

  patchProps(el, {}, attrs)
  dom.removeElem(el)
  node.el = n.el = null
}
