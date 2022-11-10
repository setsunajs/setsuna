import { ElementNode, VNode } from "../../../runtime.type"
import { dom } from "../../../dom"
import { excludes, isFunction } from "@setsunajs/shared"

export function normalizeElementNode(
  node: VNode,
  create: boolean
): ElementNode {
  const { type, props, children } = node
  const tag = isFunction(type) ? (type as any).displayName : type
  return (node._n = {
    el: create ? dom.createElem(tag, props) : null,
    tag,
    ref: null,
    attrs: excludes(props, key => key === "ref"),
    children
  })
}
