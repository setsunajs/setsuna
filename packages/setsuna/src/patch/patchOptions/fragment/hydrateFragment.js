import { error } from "../../../handler/errorHandler"
import {
  getElementNextSibling,
  getNextSibling,
  removeElement
} from "../../../node/nodeOpts"
import { hydrateChildren } from "../../patchChildren"
import { mountFragment } from "./mountFragment"

export function hydrateFragment(context) {
  const { newVNode: node, container } = context
  node._e ?? (node._e = { container })

  let { hydrateNode } = context
  hydrateNode = hydrateNode ?? container.firstChild
  if (!hydrateNode || hydrateNode.textContent.trim() !== "Fragment") {
    error(
      "hydrate fragment",
      `节点对不上，期望得到(<Fragment/>)，却匹配到(${
        hydrateNode ? hydrateNode.tagName.toLowerCase() : "null"
      }) fragment 节点对不上`,
      []
    )

    mountFragment({ ...context, hydrate: false, anchor: hydrateNode })
    return hydrateNode
  }

  const removeNode = hydrateNode
  hydrateNode = getElementNextSibling(hydrateNode)
  removeElement(removeNode)

  const nextHydrateNode = hydrateChildren(node.children, {
    ...context,
    hydrateNode
  })
  node.el = node.children[0]?.el
  node.anchor = getNextSibling(node.children.at(-1))
  return nextHydrateNode
}
