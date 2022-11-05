import { VNode } from './../../../jsx';
import { PatchContext } from "../../patch"
import { mountChildren } from "../../patchChildren"
import { dom } from "../../../dom"

export function mountFragment(context: PatchContext) {
  const node = context.newVNode!
  mountChildren(node.children, context)
  node.el = (node.children[0] as VNode).el || null
  node.anchor = dom.getNextSiblingNode(node.children.slice(-1)[0] as VNode)
}