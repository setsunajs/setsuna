import { setTextContent } from "../../../dom"

export function updateTextElement({ oldVNode, newVNode: node }) {
  const { children: oldContent, el } = oldVNode._e
  const newContent = node.children[0]

  if (oldContent !== newContent) {
    setTextContent(el, newContent)
  }

  node._e = { el, children: newContent }
  node.el = oldVNode.el
}
