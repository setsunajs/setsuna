import { hydrateFragment } from "./hydrateFragment"
import { mountFragment } from "./mountFragment"
import { updateFragment } from "./updateFragment"

export function patchFragment(context) {
  const { oldVNode, hydrate } = context
  return oldVNode
    ? updateFragment(context)
    : !hydrate
    ? mountFragment(context)
    : hydrateFragment(context)
}
