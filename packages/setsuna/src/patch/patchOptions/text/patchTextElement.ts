import { PatchContext } from "../../../runtime.type"
import { hydrateTextElement } from "./hydrateTextElement"
import { mountTextElement } from "./mountTextElement"
import { updateTextElement } from "./updateTextElement"

export function patchTextElement(context: PatchContext) {
  const { oldVNode, hydrate } = context
  return oldVNode
    ? updateTextElement(context)
    : !hydrate
    ? mountTextElement(context)
    : hydrateTextElement(context)
}
