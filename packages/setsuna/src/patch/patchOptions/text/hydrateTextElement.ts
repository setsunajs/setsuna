import { error } from "../../../handler/errorHandler"
import { dom } from "../../../dom"
import { mountTextElement } from "./mountTextElement"
import { PatchContext } from "../../patch"
import { TextNode } from "./mountTextElement"

export function hydrateTextElement(context: PatchContext) {
  const { container } = context
  const node = context.newVNode!

  let { hydrateNode } = context
  hydrateNode = hydrateNode ?? container.firstChild

  if (!hydrateNode) {
    error(
      "hydrate text",
      `node mismatch, expected '<Text/>', but matched 'null'`
    )

    mountTextElement({ ...context, anchor: null })
    return null
  }

  const realContent = hydrateNode.textContent
  const content = node.text
  if (realContent !== content) {
    error(
      "hydrate text",
      `node mismatch, expected '${content}', but matched '${realContent}'`
    )

    dom.setElemText(hydrateNode, content)
  }

  const textNode: TextNode = { content }
  node.el = hydrateNode
  node._n = textNode

  return dom.getNextSibling(hydrateNode)
}
