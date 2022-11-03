import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { registryRecord } from "../../../hmr/hmr"
import { appendJob } from "../../../scheduler"
import { isFunction } from "@setsunajs/share"
import { setCurrentInstance } from "./currentInstance"
import { createRenderComponentEffect } from "./renderComponentEffect"
import { error } from "../../../handler/errorHandler"

let cid = 0
export function mountComponent(context) {
  const {
    newVNode: node,
    container,
    anchor,
    parentComponent,
    deep,
    hydrate,
    hydrateNode
  } = context
  const { type, props, children } = node
  const c = (node._c = {
    cid: cid++,
    FC: type,
    props,
    container,
    parentComponent,
    slot: children,
    subTree: null,
    render: null,
    observable: [],
    deps: new Set(),
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
    registryRecord(node._hmrId, update)
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

function bindReactiveUpdate(input$, { update }) {
  input$.subscribe(() => appendJob(update))
}

function bindContextUpdate({ input$ }, { update }) {
  input$.subscribe(() => appendJob(update, true))
}
