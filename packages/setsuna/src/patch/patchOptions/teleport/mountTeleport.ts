import { Fragment } from "../../../components/Fragment"
import { jsx } from "../../../jsx"
import { dom } from "../../../dom"
import { render } from "../../../render"
import { isString } from "@setsunajs/shared"
import { error } from "../../../handler/errorHandler"
import { PatchContext, TeleportNode, VNode } from "../../../runtime.type"

export function mountTeleport(context: PatchContext) {
  const node = context.newVNode!
  const to = node.props.to
  const container = isString(to)
    ? dom.query(to)
    : to instanceof Element
    ? to
    : null
  if (!container)
    return error("Teleport", "Teleport props.to ss not a valid selector")

  const Body = jsx(() => () => jsx(Fragment, {}, node.children), {})
  const teleportNode: TeleportNode = { Body, container, VNode: node, to }

  render(Body, container)
  node.el = null
  node._n = teleportNode
}
