import { appendJob } from "../../../scheduler"
import { PatchContext } from "../../patch"

export function updateComponent(context: PatchContext) {
  const { deep } = context
  const node = context.newVNode!
  const oldVNode = context.oldVNode!
  const { _c: c, update } = oldVNode

  node._c = c
  node.update = update

  c.slot = node.children
  c.VNode = node

  deep ? appendJob(update!, (update!.deep = true)) : appendJob(update!)
}
