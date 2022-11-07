import { dom } from "../../../dom"
import { isFunction, isPromise, resolveNextNodes } from "@setsunajs/shared"
import { hydrateFragment } from "../fragment/hydrateFragment"
import { mountAwait } from "./mountAwait"
import { PatchContext } from "../../patch"
import { error } from "../../../handler/errorHandler"
import { normalizeChildren } from "../../../jsx"

export function hydrateAwait(context: PatchContext) {
  const node = context.newVNode!
  const { container } = context
  const { children } = node

  let { hydrateNode } = context
  hydrateNode = hydrateNode ?? container.firstChild
  if (!hydrateNode || hydrateNode.textContent !== "Await") {
    error(
      "hydrate Await",
      `node mismatch, expected '<Await />', but expected '${
        hydrateNode ? hydrateNode.nodeName : "null"
      }'`
    )

    mountAwait({ ...context, hydrate: false, anchor: hydrateNode })
    return hydrateNode
  }

  const hasAsync = children.some(
    content => isFunction(content) || isPromise(content)
  )
  const e = node._n ?? (node._n = { id: 0, container, VNode: node })
  const id = e.id
  const endHydrateNode = resolveNextNodes(
    hydrateNode as ChildNode,
    "Await"
  )!.at(-1)!

  if (!hasAsync) {
    context.hydrateNode = dom.getNextSibling(hydrateNode)
    node.children = normalizeChildren(children)

    dom.removeElem(hydrateNode)
    dom.removeElem(endHydrateNode)

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

    context.hydrateNode = dom.getNextSibling(e.hydrateNode)
    node.children = normalizeChildren(_children)

    dom.removeElem(e.hydrateNode)
    dom.removeElem(e.endHydrateNode)
    e.hydrating = false
    e.hydrateNode = e.endHydrateNode = null

    hydrateFragment(context)
  })

  return dom.getNextSibling(e.endHydrateNode)
}
