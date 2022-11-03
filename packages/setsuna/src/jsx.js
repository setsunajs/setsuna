import { omit } from "@setsunajs/share"
import { isArray, isFunction, isPlainObject, isPromise } from "@setsunajs/share"

export const _node_flag = Symbol("VNode")
export const isVNode = value => isPlainObject(value) && value[_node_flag]

export * from "./components/Fragment"

export const _jsx = (type, props, ...children) => {
  const _props = props ?? {}
  const VNode = {
    type,
    key: _props.key,
    props: omit(_props, ["key"]),
    children:
      type === "text" ? children : normalizeChildren(children)._children,
    _c: null,
    _e: null,
    [_node_flag]: true
  }
  if (isFunction(type)) {
    VNode._hmrId = type.hmrId
    VNode._file = type.file
  }
  return VNode
}

export function normalizeChildren(
  children,
  options = { _children: [], textNode: "", top: true }
) {
  const size = children.length
  for (let index = 0; index < size; index++) {
    const item = children[index]

    if (item === null || item === undefined) {
      continue
    } else if (isVNode(item) || isPromise(item) || isFunction(item)) {
      if (options.textNode.length > 0) {
        options._children.push(_jsx("text", {}, options.textNode))
        options.textNode = ""
      }
      options._children.push(item)
    } else if (isArray(item)) {
      normalizeChildren(item, { ...options, top: false })
    } else {
      options.textNode += String(item)
    }
  }
  if (options.top && options.textNode.length > 0) {
    options._children.push(_jsx("text", {}, options.textNode))
    options.textNode = ""
  }
  return options
}
