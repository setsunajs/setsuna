import { error } from "../../../handler/errorHandler"
import { getElementNextSibling, removeElement } from "../../../node/nodeOpts"
import { hydrateChildren, mountChildren } from "../../patchChildren"
import { hydrateProps, patchProps } from "../../patchProps"
import { ignoreElement } from "./ignoreElement"
import { mountElement } from "./mountElement"
import { normalizeElementNode } from "./normalizeElementNode"
import { setElementRef } from "./setElementRef"

export function hydrateElement(context) {
  const { newVNode: node, container, hydrateNode } = context
  const { type, children } = node
  const e = normalizeElementNode(node, false)
  const isCustomWrapper = ignoreElement.has(type)
  const isCustomElement = isCustomWrapper || type.includes("-")
  const el = (e.el = hydrateNode ?? container.firstChild)

  if (!el) {
    error(
      "hydrate element",
      `节点不匹配，期望得到(<${e.tag}/>)，却匹配到(${el})`
    )
    mountElement({ ...context, hydrate: false, anchor: null })
    return null
  }

  if (el.tagName.toLowerCase() !== e.tag) {
    error(
      "hydrate element",
      `节点对不上，期望得到(<${
        e.tag
      }/>)，却匹配到(<${el.tagName.toLowerCase()}/>)`
    )

    const anchor = getElementNextSibling(el)
    removeElement(el)
    mountElement({ ...context, hydrate: false, anchor })
    return anchor
  }

  !isCustomWrapper && !isCustomElement
    ? hydrateProps(el, e.attrs)
    : patchProps(e.el, e.attrs, {})

  hydrateChildren(children, { ...context, hydrateNode: null, container: el })

  setElementRef(e)
  node.el = el

  return isCustomWrapper ? el.hydrate(context) : getElementNextSibling(el)
}
