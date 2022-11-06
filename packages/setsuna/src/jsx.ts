import {
  isArray,
  isFunction,
  isPlainObject,
  isPromise,
  excludes
} from "@setsunajs/shared"
import { RenderComponentEffect } from "./patch/patchOptions/component/renderComponentEffect"

export type Component<P = {}> = {
  (props: P): SeElement<P>
  hmrId?: string
  file?: string
}
export type DOMString = string
export type EmptyNode = null
export type VNodeType<P = any> = Component<P> | DOMString | EmptyNode | any
export type VNodeKey = number | string | symbol
export type VNodeChildren = Array<
  VNode | Promise<any> | ((...args: any[]) => any) | Function
>
export type VNode = {
  type: VNodeType<any>
  key: VNodeKey
  props: Record<any, any>
  text: string
  children: VNodeChildren
  el?: Element | null
  anchor?: Node | null
  _c: any
  _n: any
  _hmrId?: string
  _file?: string
  __se_VNode: true
  update?: RenderComponentEffect
}

export type SeElement<P = {}> = {
  type: VNodeType<P>
  key: VNodeKey
  props: P
  children: SeElement[]
}

export const _node_flag = "__se_VNode"
export function isVNode(value: unknown): value is VNode {
  return isPlainObject(value) && value[_node_flag]
}

export * from "./components/Fragment"
export function jsx<P extends Record<any, any>>(
  type: VNodeType<any>,
  props: P,
  ...children: unknown[]
) {
  const _props: Record<any, any> = isPlainObject(props) ? props : {}
  const VNode: VNode = {
    type,
    key: _props.key,
    props: excludes(_props, key => key === "key") as any,
    ...(type === "text"
      ? {
          text: children[0] + "",
          children: []
        }
      : {
          text: "",
          children: normalizeChildren(children)
        }),
    _c: null,
    _n: null,
    [_node_flag]: true
  }

  if (isFunction(type)) {
    VNode._hmrId = type.hmrId
    VNode._file = type.file
  }

  return VNode as any as SeElement<P>
}

type NormalizeChildContext = {
  childrenNodes: VNodeChildren
  text: string
}
export function normalizeChildren(children: unknown[]) {
  const options: NormalizeChildContext = { childrenNodes: [], text: "" }
  children.forEach(child => normalizeChild(child, options))

  const { childrenNodes, text } = options
  if (text.length > 0) {
    childrenNodes.push(jsx("text", {}, text) as any)
  }

  return childrenNodes
}

function normalizeChild(child: unknown, ctx: NormalizeChildContext) {
  // child maybe false、[], they are created jsx function
  // but only null | undefined need nothing to do
  if (child === null || child === undefined) {
    return
  }

  if (isVNode(child) || isPromise(child) || isFunction(child)) {
    if (ctx.text.length > 0) {
      ctx.childrenNodes.push(jsx("text", {}, ctx.text) as any)
      ctx.text = ""
    }
    ctx.childrenNodes.push(child)
  } else if (isArray(child)) {
    child.forEach(childItem => normalizeChild(childItem, ctx))
  } else {
    ctx.text += child
  }
}
