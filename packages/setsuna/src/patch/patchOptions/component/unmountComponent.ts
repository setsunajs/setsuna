import { ComponentNode, VNode } from "../../../runtime.type"
import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { unmount } from "../../unmount"

export function unmountComponent(node: VNode) {
  const { update, _c: c } = node
  const { observable, context, unmounts, subTree, parentComponent } =
    c as ComponentNode

  update!.active = false
  if (parentComponent) parentComponent.deps.delete(update!)

  observable.forEach(input$ => {
    callWithErrorHandler(node, () => input$.complete())
  })

  Reflect.ownKeys(context).forEach(key => {
    callWithErrorHandler(node, () => context[key].complete())
  })

  if (subTree) unmount(subTree)

  unmounts.forEach(fn => callWithErrorHandler(node, fn))
  c.container = c.VNode.el = null
}
