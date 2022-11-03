import { patchFragment } from "../fragment/patchFragment"

export function patchSlot(context) {
  const { parentComponent, VNode, slot } = context.parentComponent
  context.newVNode.children = slot
  if (parentComponent) {
    parentComponent.deps.add(VNode.update)
  }
  return patchFragment(context)
}
