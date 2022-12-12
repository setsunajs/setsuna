import { Observable, ObservableParam } from "@setsunajs/observable"

export type Key = number | string | symbol
export type SeElement<
  P = any,
  T extends string | ((props: P) => () => SeElement<any, any> | null) =
    | string
    | ((props: P) => () => SeElement<any, any> | null)
> = {
  type: T
  props: P
  key: Key | null
}
export type SeElementChildren = Array<
  VNode | Promise<any> | ((...args: any[]) => any) | Function | null
>
export type FC<P = {}> = {
  (props: P): any
  hmrId?: string
  file?: string
}

export type VNode = {
  type: any
  key: Key
  props: Record<any, any>
  text: string
  children: SeElementChildren
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
  children: SeElementChildren
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
  FC: FC
  props: Record<any, any>
  container: Node
  parentComponent: ComponentNode
  slot: {
    value: VNode[]
  }
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
export type PickRawState<T> = T extends HookState<infer N>
  ? N extends Observable<any, infer B, any>
    ? B
    : N
  : T extends Observable<any, infer M, any>
  ? M
  : T
export type HookState<T = any> = () => PickRawState<T>
export type S<T> = HookState<T>
export type HookSetState<T> = (newState: PickRawState<T>) => PickRawState<T>
export type ComputedOptions<T, S> =
  | (() => PickRawState<T>)
  | {
      get: () => PickRawState<T>
      set?: (value: S) => unknown
    }
