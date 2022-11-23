import { VNode } from "./../../../runtime.type"
import { dom } from "../../../dom"
import { PatchContext } from "../../../runtime.type"
import { mountChildren } from "../../patchChildren"
import { patchProps } from "../../patchProps"
import { normalizeElementNode } from "./normalizeElementNode"
import { setElementRef } from "./setElementRef"
import { isWebComponent } from "../../../components/WebComponent"

export function mountElement(context: PatchContext) {
  const node = context.newVNode!
  const { anchor, container } = context
  const isCustom = isWebComponent(node.type)
  const n = normalizeElementNode(node, true)

  patchProps(n.el as Element, n.attrs, {}, isCustom)
  dom.insertElem(n.el!, container, anchor)
  mountChildren(n.children as VNode[], {
    ...context,
    anchor: null,
    container: n.el as Element
  })
  node.el = n.el
  setElementRef(node.props, n)
}
