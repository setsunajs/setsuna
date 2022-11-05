import { updateTeleport } from "./updateTeleport"
import { mountTeleport } from "./mountTeleport"
import { PatchContext } from "../../patch"

export function patchTeleport(context: PatchContext) {
  const { oldVNode } = context
  return oldVNode ? updateTeleport(context) : mountTeleport(context)
}
