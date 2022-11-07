import { dom } from "../../../dom"
import { PatchContext } from "../../patch"
import { TextNode } from "../patchNodeTypes"

export function mountTextElement(context: PatchContext) {
  const node = context.newVNode!
  const { container, anchor } = context
  const content = node.text
  const el = dom.createTextElem(content)
  const textNode: TextNode = { content }

  dom.insertElem(el, container, anchor)
  node.el = el
  node._n = textNode
}
