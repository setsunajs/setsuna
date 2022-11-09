import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { registryRecord } from "../../../hmr"
import { appendJob } from "../../../scheduler"
import { isFunction } from "@setsunajs/shared"
import { setCurrentInstance } from "./currentInstance"
import { createRenderComponentEffect } from "./renderComponentEffect"
import { error } from "../../../handler/errorHandler"
import { ComponentNode, FC, PatchContext } from "../../../runtime.type"

let cid = 0
export function mountComponent(context: PatchContext) {
  const node = context.newVNode!
  const { container, parentComponent, deep, hydrate, hydrateNode } = context
  const { type, props, children } = node
  const c: ComponentNode = (node._c = {
    cid: cid++,
    FC: type as FC,
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
    active: true,
    c,
    deep,
    hydrate,
    hydrateNode
  }))

  if (__DEV__) {
    registryRecord(node._hmrId!, update)
  }

  setCurrentInstance(c)
  let render = callWithErrorHandler(node, c.FC, _props)
  setCurrentInstance()

  if (!isFunction(render)) {
    error("component", `'render' must be a function`, [render])
    render = () => null
  }

  c.render = render

  observable.forEach(input$ => input$.subscribe(() => appendJob(update!)))
  Reflect.ownKeys(componentContext).forEach(key =>
    componentContext[key].subscribe(() => appendJob(update!, true))
  )

  return update()
}
