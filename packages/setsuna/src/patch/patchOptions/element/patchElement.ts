import { PatchContext } from "../../patch"
import { hydrateElement } from "./hydrateElement"
import { mountElement } from "./mountElement"
import { updateElement } from "./updateElement"

export function patchElement(context: PatchContext) {
  const { oldVNode, hydrate } = context
  return oldVNode
    ? updateElement(context)
    : !hydrate
    ? mountElement(context)
    : hydrateElement(context)
}
