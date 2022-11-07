import { VNode } from "./../../../jsx"
import { unmountFragment } from "../fragment/unmountFragment"
import { AwaitNode } from "../patchNodeTypes"

export function unmountAwait(node: VNode) {
  const awaitNode: AwaitNode = node._n
  awaitNode.id = -99
  unmountFragment(node)
}
