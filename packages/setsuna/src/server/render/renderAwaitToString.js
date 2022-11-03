import { isFunction } from "@setsunajs/share"
import { nodeToString } from "../pipes/pipeNodeToString"
import { normalizeChildren } from "../../jsx"

export function renderAwaitToString({ VNode: { children }, parentComponent }) {
  const childrenElement = ["<!-- Await -->", "<!-- Fragment -->"]
  const size = children.length
  for (let index = 0; index < size; index++) {
    const node = children[index]
    if (!isFunction(node)) {
      childrenElement.push(nodeToString({ VNode: node, parentComponent }))
      continue
    }

    childrenElement.push(
      new Promise(async resolve => {
        const _node = await Promise.resolve(node())
        const VNode = normalizeChildren([_node])._children[0]
        const buff = nodeToString({ VNode, parentComponent })
        resolve(buff)
      })
    )
    childrenElement.push("<!-- /Await -->")
  }
  return childrenElement
}
