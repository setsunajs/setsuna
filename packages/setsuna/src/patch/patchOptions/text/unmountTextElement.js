import { removeElement } from "../../../dom"

export function unmountTextElement(node) {
  const { el } = node
  if (!el) {
    // hmr. el is null/undefined
    return
  }

  removeElement(el)
  node.el = node._e.el = null
}
