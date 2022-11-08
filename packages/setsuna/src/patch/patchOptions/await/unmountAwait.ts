import { AwaitNode, VNode } from "../../../runtime.type"
import { unmountFragment } from "../fragment/unmountFragment"

export function unmountAwait(node: VNode) {
  const awaitNode: AwaitNode = node._n
  awaitNode.id = -99
  unmountFragment(node)
}
