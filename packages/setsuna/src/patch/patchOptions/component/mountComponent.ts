import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { registryRecord } from "../../../hmr"
import { appendJob } from "../../../scheduler"
import { isFunction } from "@setsunajs/shared"
import { setCurrentInstance } from "./currentInstance"
import {
  createRenderComponentEffect,
  RenderComponentEffect
} from "./renderComponentEffect"
import { error } from "../../../handler/errorHandler"
import { PatchContext } from "../../patch"
import { VNode, VNodeChildren } from "../../../jsx"
import { Observable } from "@setsunajs/observable"

export type ComponentContextKey = string | number | symbol
export type ComponentNode = {
  cid: number
  FC: (props: Record<any, any>) => () => VNode
  props: Record<any, any>
  container: Node
  parentComponent: ComponentNode
  slot: VNodeChildren
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

let cid = 0
export function mountComponent(context: PatchContext) {
  const node = context.newVNode!
  const { container, anchor, parentComponent, deep, hydrate, hydrateNode } =
    context
  const { type, props, children } = node
  const c: ComponentNode = (node._c = {
    cid: cid++,
    FC: type,
    props,
    container,
    parentComponent,
    slot: children,
    subTree: null,
    render: null,
    observable: [],
    deps: new Set([]),
    mounts: [],
    unmounts: [],
    updates: [],
    context: parentComponent
      ? Object.create(parentComponent.context)
      : Object.create(null),
    mounted: false,
    VNode: node
  })
  const { props: _props, observable, context: componentContext } = c
  const update = (node.update = createRenderComponentEffect({
    c,
    anchor,
    deep,
    active: true,
    hydrate,
    hydrateNode
  }))

  if (__DEV__) {
    registryRecord(node._hmrId!, update)
  }

  setCurrentInstance(c)
  let render = callWithErrorHandler(node, type, _props)
  setCurrentInstance(null)

  if (!isFunction(render)) {
    error("component", `render 应为是一个函数`, [render])
    render = () => null
  }

  c.render = render

  observable.forEach(observable => bindReactiveUpdate(observable, node))
  Reflect.ownKeys(componentContext).forEach(key =>
    bindContextUpdate(componentContext[key], node)
  )

  return update()
}

function bindReactiveUpdate(input$: Observable, { update }: VNode) {
  input$.subscribe(() => appendJob(update!))
}

function bindContextUpdate(input$: Observable, { update }: VNode) {
  input$.subscribe(() => appendJob(update!, true))
}
