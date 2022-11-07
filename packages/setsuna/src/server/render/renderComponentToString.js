import { isFunction } from "@setsunajs/share"
import { nodeToString } from "../pipes/pipeNodeToString"
import { setCurrentInstance } from "../../patch/patchOptions/component/currentInstance"
import { callWithErrorHandler } from "../../handler/callWithErrorHandler"
import { error } from "../../handler/errorHandler"

export function renderComponentToString({ VNode, parentComponent }) {
  const { type, props, children } = VNode
  const _c = (VNode._c = {
    cid: null,
    FC: type,
    props,
    container: null,
    parentComponent: null,
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
    VNode
  })

  setCurrentInstance(_c)
  const render = (_c.render = callWithErrorHandler(VNode, type, props))
  setCurrentInstance()

  if (!isFunction(render)) {
    error("component mount", `render 应为是一个函数`, [render])
    return ""
  }

  const subTree = (_c.subTree = callWithErrorHandler(VNode, render))
  if (subTree === null) {
    return ""
  }

  return nodeToString({ VNode: subTree, parentComponent: _c })
}
