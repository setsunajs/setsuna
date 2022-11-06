import { PatchContext } from "../../patch"
import { hydrateAwait } from "./hydrateAwait"
import { mountAwait } from "./mountAwait"
import { updateAwait } from "./updateAwait"

export function patchAwait(context: PatchContext) {
  const { oldVNode, hydrate } = context
  return oldVNode
    ? updateAwait(context)
    : !hydrate
    ? mountAwait(context)
    : hydrateAwait(context)
}
