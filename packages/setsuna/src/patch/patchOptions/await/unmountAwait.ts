import { VNode } from "./../../../jsx"
import { unmountFragment } from "../fragment/unmountFragment"

export function unmountAwait(node: VNode) {
  node._n = null
  unmountFragment(node)
}
