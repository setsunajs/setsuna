import { Observable } from "@setsunajs/observable"

export type VNode = {
  type: Setsuna.SeElementType
  key: Setsuna.Key
  props: Record<any, any>
  text: string
  children: Setsuna.SeElementChildren
  el?: Node | null
  anchor?: Node | null
  _c: any
  _n: any
  _hmrId?: string
  _file?: string
  __se_VNode: true
  update?: RenderComponentEffect
}

export type PatchContext = {
  oldVNode: null | VNode
  newVNode: null | VNode
  container: Node
  anchor?: null | Node
  parentComponent?: null | any
  deep: boolean
  hydrate?: boolean
  hydrateNode?: Node | null
}

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

export type RenderCompEffectOptions = {
  c: ComponentNode
  deep: boolean
  active: boolean
  hydrate: PatchContext["hydrate"]
  hydrateNode: PatchContext["hydrateNode"]
}

export type RenderComponentEffect = { (): any } & RenderCompEffectOptions

export type HookState<T> = () => T
export type HookSetState<T> = (newState: T) => T
export type ComputedOptions<T> =
  | (() => T)
  | {
      get: () => Array<Observable<T> | HookState<T>>
      set?: () => void
    }
