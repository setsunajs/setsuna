import { PatchContext } from "../../patch"
import { mountComponent } from "./mountComponent"
import { updateComponent } from "./updateComponent"

export function patchComponent(context: PatchContext) {
  return context.oldVNode ? updateComponent(context) : mountComponent(context)
}
