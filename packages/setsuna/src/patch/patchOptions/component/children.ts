import { PatchContext } from "../../../runtime.type"
import { patchFragment } from "../fragment/patchFragment"

export function patchSlot(context: PatchContext) {
  const { newVNode, parentComponent: component } = context
  if (component.parentComponent) {
    component.parentComponent.deps.add(component.update)
  }
  newVNode!.children = component.slot.value
  return patchFragment(context)
}
