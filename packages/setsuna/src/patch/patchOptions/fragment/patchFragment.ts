import { PatchContext } from "../../patch"
import { hydrateFragment } from "./hydrateFragment"
import { mountFragment } from "./mountFragment"
import { updateFragment } from "./updateFragment"

export function patchFragment(context: PatchContext) {
  const { oldVNode, hydrate } = context
  return oldVNode
    ? updateFragment(context)
    : !hydrate
    ? mountFragment(context)
    : hydrateFragment(context)
}
