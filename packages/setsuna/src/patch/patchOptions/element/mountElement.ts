import { dom } from "../../../dom"
import { PatchContext } from "../../patch"
import { mountChildren } from "../../patchChildren"
import { patchProps } from "../../patchProps"
import { normalizeElementNode } from "./normalizeElementNode"
import { setElementRef } from "./setElementRef"



export function mountElement(context: PatchContext) {
  const node = context.newVNode!
  const { anchor, container } = context
  const n = normalizeElementNode(node, true)

  patchProps(n.el as Element, n.attrs, {})
  dom.insertElem(n.el!, container, anchor)
  mountChildren(n.children, { ...context, anchor: null, container: n.el as Element })
  setElementRef(n)
  node.el = n.el
}
