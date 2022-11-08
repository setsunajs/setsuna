import { error } from "../../../handler/errorHandler"
import { dom } from "../../../dom"
import { hydrateChildren } from "../../patchChildren"
import { mountFragment } from "./mountFragment"
import { PatchContext, VNode } from "../../../runtime.type"

export function hydrateFragment(context: PatchContext) {
  const node = context.newVNode!
  const container = context.container

  let { hydrateNode } = context
  hydrateNode = hydrateNode ?? container.firstChild

  if (!hydrateNode || hydrateNode.textContent !== "Fragment") {
    error(
      "hydrate fragment",
      `node mismatch, expected '<Fragment/>', but matched(${
        hydrateNode ? hydrateNode.nodeName : "null"
      })`
    )

    mountFragment({ ...context, hydrate: false, anchor: hydrateNode })
    return hydrateNode
  }

  const removeNode = hydrateNode
  hydrateNode = dom.getNextSibling(hydrateNode)
  dom.removeElem(removeNode)

  const nextHydrateNode = hydrateChildren(
    node.children as VNode[],
    Object.assign(context, { hydrateNode })
  )
  node.el = (node.children[0] as VNode).el
  node.anchor = dom.getNextSiblingNode((node.children.at(-1) as any)?.el)
  return nextHydrateNode
}
