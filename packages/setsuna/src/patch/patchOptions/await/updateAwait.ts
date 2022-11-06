import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { normalizeChildren } from "../../../jsx"
import { dom } from "../../../dom"
import { isFunction, isPromise, resolveNextNodes } from "@setsunajs/shared"
import { patchFragment } from "../fragment/patchFragment"
import { AwaitNode, mountAwait } from "./mountAwait"
import { PatchContext } from "../../patch"

export function updateAwait(context: PatchContext) {
  const node = context.newVNode!
  const oldVNode = context.oldVNode!
  const { props, children } = node
  const n: AwaitNode = (node._n = oldVNode._n)
  const { id } = n

  node.children = oldVNode.children
  node.el = oldVNode.el
  n.VNode = node

  if (n.hydrating) {
    const _nodes = resolveNextNodes(n.hydrateNode!, "Await")!
    context.anchor = dom.getNextSibling(_nodes.at(-1) as ChildNode)
    _nodes.forEach(dom.removeElem)
    Object.assign(n, {
      id: id + 1,
      hydrating: false,
      hydrateNode: null,
      endHydrateNode: null
    })
    context.oldVNode = null
    mountAwait(context)
    return
  }

  const _active = node.props.active
  const active = isFunction(_active)
    ? callWithErrorHandler(node, _active)
    : _active

  if (!active) {
    return
  }

  n.id += 1

  if (children.some(content => isFunction(content) || isPromise(content))) {
    node.children = normalizeChildren([props.fallback])

    Promise.all(
      children.map(content =>
        Promise.resolve(isFunction(content) ? content() : content)
      )
    ).then(_children => {
      if (n.id - 1 !== id) {
        return
      }

      const newVNode = {
        ...n.VNode,
        children: normalizeChildren(_children)
      }
      patchFragment({ ...context, oldVNode: n.VNode, newVNode: newVNode })
      Object.assign(n.VNode, newVNode)
    })
  } else {
    node.children = normalizeChildren(children)
  }

  patchFragment(context)
}
