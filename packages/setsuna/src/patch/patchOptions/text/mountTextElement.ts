import { dom } from "../../../dom"
import { PatchContext } from "../../patch"

export type TextNode = {
  content: string
}

export function mountTextElement(context: PatchContext) {
  const { container, anchor } = context
  const node = context.newVNode!
  const content = node.text
  const el = dom.createTextElem(content)
  const textNode: TextNode = { content }

  dom.insertElem(el, container, anchor)
  node.el = el
  node._n = textNode
}
