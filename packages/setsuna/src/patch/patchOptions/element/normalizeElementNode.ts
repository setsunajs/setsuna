import { VNode, VNodeChildren } from "./../../../jsx"
import { dom } from "../../../dom"
import { excludes, isFunction } from "@setsunajs/shared"
import { ElementNode } from "./mountElement"

export function normalizeElementNode(node: VNode, create: boolean): ElementNode {
  const { type, props, children } = node
  const tag = isFunction(type) ? type.displayName : type
  return (node._n = {
    el: create ? dom.createElem(tag, props) : null,
    tag,
    ref: props.ref,
    attrs: excludes(props, key => key === "ref"),
    children,
    VNode: node
  })
}
