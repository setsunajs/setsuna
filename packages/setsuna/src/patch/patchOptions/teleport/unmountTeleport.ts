import { VNode } from "../../../runtime.type"
import { unmount } from "../../unmount"

export function unmountTeleport(node: VNode) {
  unmount(node._n.Body)
  node._n = null
}
