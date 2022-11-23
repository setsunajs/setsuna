import { VNode } from "./../../../runtime.type"
import { error } from "../../../handler/errorHandler"
import { dom } from "../../../dom"
import { hydrateChildren } from "../../patchChildren"
import { hydrateProps, patchProps } from "../../patchProps"
import { mountElement } from "./mountElement"
import { normalizeElementNode } from "./normalizeElementNode"
import { setElementRef } from "./setElementRef"
import { PatchContext } from "../../../runtime.type"
import { webCustomElement } from "./webCustomElement"

export function hydrateElement(context: PatchContext) {
  const node = context.newVNode!
  const { container, hydrateNode } = context
  const n = normalizeElementNode(node, false)

  const { type, children } = node
  const isCustomWrapper = webCustomElement.has(type as string)
  const isCustomElement = isCustomWrapper || (type as string).includes("-")

  const el = (n.el = hydrateNode ?? container.firstChild)
  if (!el) {
    error(
      "hydrate element",
      `node mismatch, expected '<${n.tag}/>', but matched('null')`
    )

    mountElement({ ...context, hydrate: false, anchor: null })
    return null
  }

  if (el.nodeName.toLowerCase() !== n.tag) {
    error(
      "hydrate element",
      `node mismatch, expected '<${n.tag}/>', but matched('${el.nodeName}')`
    )

    const anchor = dom.getNextSibling(el)
    dom.removeElem(el)
    mountElement({ ...context, hydrate: false, anchor })
    return anchor
  }

  !isCustomWrapper && !isCustomElement
    ? hydrateProps(el as Element, n.attrs)
    : patchProps(n.el as Element, n.attrs, {}, false)

  hydrateChildren(children as VNode[], {
    ...context,
    hydrateNode: null,
    container: el
  })

  setElementRef(node.props, n)
  node.el = el

  return isCustomWrapper ? (el as any).hydrate(context) : dom.getNextSibling(el)
}
