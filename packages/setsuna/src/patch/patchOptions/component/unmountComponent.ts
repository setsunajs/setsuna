import { VNode } from './../../../jsx';
import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { unmount } from "../../unmount"
import { ComponentNode } from './mountComponent';

export function unmountComponent(node: VNode) {
  const { update, _c: c } = node
  const { observable, context, unmounts, subTree, parentComponent } = (c as ComponentNode)

  update.active = false
  if (parentComponent) {
    parentComponent.deps.delete(update)
  }

  observable.forEach(input$ => {
    callWithErrorHandler(node, () => input$.complete())
  })

  Reflect.ownKeys(context).forEach(key => {
    callWithErrorHandler(node, () => {
      context[key].input$.complete()
    })
  })

  if (subTree) {
    unmount(subTree)
  }

  unmounts.forEach(fn => callWithErrorHandler(node, fn))
  c.container = c.VNode.el = null
}
