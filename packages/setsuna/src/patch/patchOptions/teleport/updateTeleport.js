import { Fragment } from "../../../components/Fragment"
import { _jsx } from "../../../jsx"
import { patch } from "../../patch"
import { mountTeleport } from "./mountTeleport"
import { unmountTeleport } from "./unmountTeleport"

export function updateTeleport(context) {
  const { oldVNode, newVNode: node, shallow } = context
  const e = oldVNode._e
  const to = node.props.to

  if (!Object.is(to, e.to)) {
    unmountTeleport(oldVNode)
    mountTeleport({ ...context, oldVNode: null })
    return
  }

  patch({
    oldVNode: e.Body,
    newVNode: (e.Body = _jsx(() => () => _jsx(Fragment, {}, node.children))),
    container: e.container,
    shallow
  })

  node._e = e
  node.el = null
}
