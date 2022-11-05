import { createTextElement, insertElement } from "../../../dom"

export function mountTextElement(context) {
  const { newVNode: node, container, anchor } = context
  const content = node.children[0]
  const { el } = (node._e = {
    el: createTextElement(content),
    children: content
  })

  insertElement(el, container, anchor)
  node.el = el
}
