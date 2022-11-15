import { ElementNode, VNode } from "../../../runtime.type"
import { dom } from "../../../dom"
import { excludes, isFunction, isPlainObject, humpToTransverse } from "@setsunajs/shared"

export function normalizeElementNode(
  node: VNode,
  create: boolean
): ElementNode {
  const { type, props, children } = node
  const tag = isFunction(type) ? (type as any).displayName : type
  if (isPlainObject(props.style)) {
    let styleStr = " "
    for (const key in props.style) {
      const value = props.style[key]
      styleStr += ` ${humpToTransverse(key)}: ${value};`
    }
    props.style = styleStr.trim()
  }
  return (node._n = {
    el: create ? dom.createElem(tag, props) : null,
    tag,
    ref: null,
    attrs: excludes(props, key => key === "ref"),
    children
  })
}
