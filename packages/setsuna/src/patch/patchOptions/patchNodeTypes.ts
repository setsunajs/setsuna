import { Observable } from "@setsunajs/observable"
import { VNode } from "../../jsx"
import { RenderComponentEffect } from "./component/renderComponentEffect"

export type ElementNode = {
  el: Node | null
  tag: string
  ref?: Observable | null
  attrs: Record<any, any>
  children: Setsuna.SeElementChildren
}

export type AwaitNode = {
  id: number
  hydrating?: boolean
  hydrateNode?: ChildNode | null
  endHydrateNode?: ChildNode | null
}

export type TeleportNode = {
  Body: VNode
  container: Node
  to: string | Node
  VNode: VNode
}

export type TextNode = {
  content: string
}

export type ComponentContextKey = string | number | symbol
export type ComponentNode = {
  cid: number
  FC: Setsuna.FC
  props: Record<any, any>
  container: Node
  parentComponent: ComponentNode
  slot: Setsuna.SeElementChildren
  subTree: VNode | null
  render: (() => VNode) | null
  observable: Array<Observable>
  deps: Set<RenderComponentEffect>
  mounts: Array<(...args: any[]) => any>
  unmounts: Array<(...args: any[]) => any>
  updates: Array<(...args: any[]) => any>
  context: Record<ComponentContextKey, Observable>
  mounted: boolean
  VNode: VNode
}
