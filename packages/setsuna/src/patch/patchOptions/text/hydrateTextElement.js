import { error } from "../../../handler/errorHandler"
import { getElementNextSibling, setTextContent } from "../../../dom"
import { mountTextElement } from "./mountTextElement"

export function hydrateTextElement(context) {
  const { newVNode: node, container } = context
  let { hydrateNode } = context
  hydrateNode = hydrateNode ?? container.firstChild

  if (!hydrateNode) {
    error("hydrate text", `节点对不上，期望得到(<text />)，却匹配到(\`null\`)`)
    mountTextElement({ ...context, anchor: null })
    return null
  }

  const _content = hydrateNode.textContent
  const content = node.children[0]
  if (_content !== content) {
    error(
      "hydrate text",
      `节点对不上，期望得到(\`${content}\`)，却匹配到(\`${_content}\`)`
    )
    setTextContent(hydrateNode, content)
  }

  node._e = { el: hydrateNode, children: content }
  node.el = hydrateNode

  return getElementNextSibling(hydrateNode)
}
