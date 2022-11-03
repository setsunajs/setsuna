import { patchChildren } from "../../patchChildren"
import { patchProps } from "../../patchProps"
import { normalizeElementNode } from "./normalizeElementNode"

export function updateElement(context) {
  const { oldVNode, newVNode, ...rest } = context
  const oe = oldVNode._e
  const e = Object.assign(normalizeElementNode(newVNode), { el: oe.el })

  patchProps(e.el, e.attrs, oe.attrs)
  patchChildren(oe.children, e.children, {
    ...rest,
    container: e.el
  })
  newVNode.el = oldVNode.el
}
