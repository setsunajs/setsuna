import { ElementNode, VNode } from "../../../runtime.type"
import { dom } from "../../../dom"
import { patchProps } from "../../patchProps"
import { unmount } from "../../unmount"
import { isWebComponent } from "../../../components/WebComponent"

export function unmountELement(node: VNode) {
  const n: ElementNode = node._n
  const { el, attrs, ref } = n

  n.children.forEach(unmount as any)

  if (!el) return // hmr. el is null/undefined

  if (ref) {
    n.ref = null
    ref.complete()
  }

  !isWebComponent(n.tag) && patchProps(el as Element, {}, attrs, false)
  dom.removeElem(el)
  node.el = n.el = null
}
