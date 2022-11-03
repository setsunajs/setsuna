import { appendJob } from "../../../scheduler"

export function updateComponent(context) {
  const { oldVNode, newVNode, deep } = context
  const { _c: c, update } = oldVNode
  newVNode._c = c
  newVNode.update = update
  c.slot = newVNode.children
  c.VNode = newVNode

  if (deep) {
    appendJob(update, (update.deep = true))
  } else {
    appendJob(update)
  }
}
