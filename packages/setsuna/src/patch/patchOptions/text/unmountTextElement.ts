import { VNode } from "./../../../jsx"
import { dom } from "../../../dom"

export function unmountTextElement(node: VNode) {
  const { el } = node
  if (!el) {
    // hmr. el is null/undefined
    return
  }

  dom.removeElem(el)
  node.el = node._n.el = null
}
