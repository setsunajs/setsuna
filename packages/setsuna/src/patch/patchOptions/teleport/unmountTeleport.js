import { unmount } from "../../unmount"

export function unmountTeleport(VNode) {
  unmount(VNode._e.Body)
  VNode._e = null
}
