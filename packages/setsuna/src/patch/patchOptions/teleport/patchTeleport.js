import { updateTeleport } from "./updateTeleport"
import { mountTeleport } from "./mountTeleport"

export function patchTeleport(context) {
  const { oldVNode } = context
  return oldVNode ? updateTeleport(context) : mountTeleport(context)
}
