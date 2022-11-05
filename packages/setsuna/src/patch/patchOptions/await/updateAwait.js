import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { normalizeChildren } from "../../../jsx"
import { getElementNextSibling, removeElement } from "../../../dom"
import { resolveNextNodes } from "@setsunajs/share"
import { isFunction, isPromise } from "@setsunajs/share"
import { patchFragment } from "../fragment/patchFragment"
import { mountAwait } from "./mountAwait"

export function updateAwait(context) {
  const { newVNode, oldVNode } = context
  const { props, children } = newVNode
  const e = (newVNode._e = oldVNode._e)
  const id = e.id

  // 防止因为 active 阻碍更新后，后边的 children diff 对不上
  newVNode.children = oldVNode.children
  newVNode.el = oldVNode.el
  e.VNode = newVNode

  if (e.hydrating) {
    const _nodes = resolveNextNodes(e.hydrateNode, "Await")
    context.anchor = getElementNextSibling(_nodes.at(-1))
    _nodes.forEach(removeElement)
    Object.assign(e, {
      id: id + 1,
      hydrating: false,
      hydrateNode: null,
      endHydrateNode: null
    })
    context.oldVNode = null
    mountAwait(context)
    return
  }

  const _active = newVNode.props.active
  const active = isFunction(_active)
    ? !!callWithErrorHandler(newVNode, _active)
    : false

  if (!active) {
    return
  }

  e.id = id + 1

  if (children.some(content => isFunction(content) || isPromise(content))) {
    newVNode.children = normalizeChildren([props.fallback])._children

    Promise.all(
      children.map(content =>
        Promise.resolve(isFunction(content) ? content() : content)
      )
    ).then(_children => {
      if (e.id - 1 !== id) {
        return
      }

      const newVNode = {
        ...e.VNode,
        children: normalizeChildren(_children)._children
      }
      patchFragment({ ...context, oldVNode: e.VNode, newVNode: newVNode })
      Object.assign(e.VNode, newVNode)
    })
  } else {
    newVNode.children = normalizeChildren(children)._children
  }

  patchFragment(context)
}
