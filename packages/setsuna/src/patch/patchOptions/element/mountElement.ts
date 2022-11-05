import { VNode, VNodeChildren } from "./../../../jsx"
import { dom } from "../../../dom"
import { PatchContext } from "../../patch"
import { mountChildren } from "../../patchChildren"
import { patchProps } from "../../patchProps"
import { normalizeElementNode } from "./normalizeElementNode"
import { setElementRef } from "./setElementRef"
import { Observable } from "@setsunajs/observable"

export type ElementNode = {
  el: Node | null
  tag: string
  ref?: Observable | null
  attrs: Record<any, any>
  children: VNodeChildren
  VNode: VNode
}

export function mountElement(context: PatchContext) {
  const { anchor, container } = context
  const node = context.newVNode!
  const n = normalizeElementNode(node, true)

  patchProps(n.el, n.attrs, {})
  dom.insertElem(n.el!, container, anchor)
  mountChildren(n.children, { ...context, anchor: null, container: n.el })
  setElementRef(n)
  node.el = n.el
}
