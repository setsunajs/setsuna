import { dom } from "../../../dom"
import { PatchContext } from "../../patch"
import { TextNode } from "./mountTextElement"

export function updateTextElement(context: PatchContext) {
  const node = context.newVNode!
  const oldVNode = context.oldVNode!
  const { content } = oldVNode._n as TextNode
  const newContent = node.text

  if (content !== newContent) {
    dom.setElemText(node.el!, newContent)
  }

  const textNode: TextNode = { content: newContent }
  node.el = oldVNode.el
  node._n = textNode
}
