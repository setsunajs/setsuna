import { PatchContext } from "../../../runtime.type"
import { patchFragment } from "../fragment/patchFragment"

export function patchSlot(context: PatchContext) {
  const { newVNode, parentComponent, childrenComponent } = context
  const component = childrenComponent ?? parentComponent
  if (component.parentComponent) {
    component.parentComponent.deps.add(component.update)
  }
  newVNode!.children = component.slot
  context.childrenComponent = component.parentComponent
  return patchFragment(context)
}
