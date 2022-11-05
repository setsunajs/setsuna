import { VNode } from "./../../../jsx"
import { Fragment } from "../../../components/Fragment"
import { jsx } from "../../../jsx"
import { patch, PatchContext } from "../../patch"
import { mountTeleport, TeleportNode } from "./mountTeleport"
import { unmountTeleport } from "./unmountTeleport"

export function updateTeleport(context: PatchContext) {
  const { deep } = context
  const node = context.newVNode!
  const oldVNode = context.oldVNode!
  const n: TeleportNode = oldVNode._n
  const to = node.props.to

  if (!Object.is(to, n.to)) {
    unmountTeleport(oldVNode)
    mountTeleport({ ...context, oldVNode: null })
    return
  }

  patch({
    oldVNode: n.Body,
    newVNode: (n.Body = jsx(
      () => () => jsx(Fragment, {}, node.children),
      {}
    ) as VNode),
    container: n.container,
    deep
  })

  node.el = null
  node._n = n
}
