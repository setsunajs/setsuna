import { Fragment } from "../../../components/Fragment"
import { _jsx } from "../../../jsx"
import { querySelector } from "../../../dom"
import { render } from "../../../render"
import { isString } from "@setsunajs/share"
import { error } from "../../../handler/errorHandler"

export function mountTeleport(context) {
  const node = context.newVNode
  const to = node.props.to
  const Body = _jsx(() => () => _jsx(Fragment, {}, node.children))
  const containerSel = node.props.to
  const container = isString(containerSel)
    ? querySelector(containerSel)
    : containerSel
  if (!container) {
    return error("Teleport", "Teleport props to 不是一个有效的选择器")
  }

  render(Body, container)
  node._e = { Body, container, to, VNode: node }
  node.el = null
}
