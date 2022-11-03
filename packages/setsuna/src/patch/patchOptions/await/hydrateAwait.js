import { normalizeChildren } from "../../../external"
import { getElementNextSibling, removeElement } from "../../../node/nodeOpts"
import { resolveNextNodes } from "@setsunajs/share"
import { isFunction, isPromise } from "@setsunajs/share"
import { hydrateFragment } from "../fragment/hydrateFragment"
import { mountAwait } from "./mountAwait"

export function hydrateAwait(context) {
  const { newVNode: node, container } = context
  const { children } = node

  let { hydrateNode } = context
  hydrateNode = hydrateNode ?? container.firstChild
  if (!hydrateNode || hydrateNode.textContent.trim() !== "Await") {
    error(
      "hydrate Await",
      `节点不匹配，期望得到(<Await />)，却匹配到(${
        hydrateNode ? hydrateNode.tagName.toLowerCase() : "null"
      })`,
      []
    )

    mountAwait({ ...context, hydrate: false, anchor: hydrateNode })
    return hydrateNode
  }

  const hasAsync = children.some(
    content => isFunction(content) || isPromise(content)
  )
  const e = node._e ?? (node._e = { id: 0, container, VNode: node })
  const id = e.id
  const endHydrateNode = resolveNextNodes(hydrateNode, "Await").at(-1)

  if (!hasAsync) {
    context.hydrateNode = getElementNextSibling(hydrateNode)
    node.children = normalizeChildren(children)._children

    removeElement(hydrateNode)
    removeElement(endHydrateNode)

    return hydrateFragment(context)
  }

  Object.assign(e, { hydrating: true, hydrateNode, endHydrateNode })

  Promise.all(
    children.map(content =>
      Promise.resolve(isFunction(content) ? content() : content)
    )
  ).then(_children => {
    if (e.id !== id) {
      return
    }

    context.hydrateNode = getElementNextSibling(e.hydrateNode)
    node.children = normalizeChildren(_children)._children

    removeElement(e.hydrateNode)
    removeElement(e.endHydrateNode)
    e.hydrating = false
    e.hydrateNode = e.endHydrateNode = null

    hydrateFragment(context)
  })

  return getElementNextSibling(e.endHydrateNode)
}
