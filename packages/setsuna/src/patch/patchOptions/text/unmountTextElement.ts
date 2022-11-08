import { VNode } from "../../../runtime.type"
import { dom } from "../../../dom"

export function unmountTextElement(node: VNode) {
  const { el } = node
  if (!el) return // hmr. el is null/undefined

  dom.removeElem(el)
  node.el = node._n.el = null
}
