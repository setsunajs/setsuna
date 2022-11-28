import { ComponentNode, VNode } from "../../../runtime.type"
import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { unmount } from "../../unmount"

export function unmountComponent(node: VNode) {
  const { update, _c: c } = node
  const { observable, context, unmounts, subTree, deps } = c as ComponentNode

  update!.active = false

  deps.clear()

  observable.forEach(input$ => {
    callWithErrorHandler(node, () => !input$.closed && input$.complete())
  })

  Reflect.ownKeys(context).forEach(key => {
    callWithErrorHandler(node, () => context[key].complete())
  })

  if (subTree) unmount(subTree)

  unmounts.forEach(fn => callWithErrorHandler(node, fn))
  c.container = c.VNode.el = null
}
