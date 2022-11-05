import { insertElement } from "../../../dom"
import { mountChildren } from "../../patchChildren"
import { patchProps } from "../../patchProps"
import { normalizeElementNode } from "./normalizeElementNode"
import { setElementRef } from "./setElementRef"

export function mountElement(context) {
  const { newVNode: node, anchor, container } = context
  const e = normalizeElementNode(node, true)

  patchProps(e.el, e.attrs, {})
  insertElement(e.el, container, anchor)
  mountChildren(e.children, { ...context, anchor: null, container: e.el })
  setElementRef(e)
  node.el = e.el
}
