import { dom } from "../../../dom"
import { PatchContext, TextNode } from "../../../runtime.type"
export function updateTextElement(context: PatchContext) {
  const node = context.newVNode!
  const oldVNode = context.oldVNode!
  const { content } = oldVNode._n as TextNode
  const newContent = node.text

  node.el = oldVNode.el
  node._n = oldVNode._n

  if (content !== newContent) {
    const textNode: TextNode = { content: newContent }
    node._n = textNode
    dom.setElemText(node.el!, newContent)
  }
}
