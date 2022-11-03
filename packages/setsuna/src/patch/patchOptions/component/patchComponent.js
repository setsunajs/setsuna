import { mountComponent } from "./mountComponent"
import { updateComponent } from "./updateComponent"

export function patchComponent(context) {
  return context.oldVNode ? updateComponent(context) : mountComponent(context)
}
