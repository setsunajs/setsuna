import { normalizeChildren } from "../../../jsx"
import { isFunction, isPromise } from "@setsunajs/share"
import { patchFragment } from "../fragment/patchFragment"

export function mountAwait(context) {
  const { newVNode: node, container } = context
  const { props, children } = node
  const hasAsync = children.some(
    content => isFunction(content) || isPromise(content)
  )
  const e = node._e ?? (node._e = { id: 0, container, VNode: node })
  const id = e.id

  if (hasAsync) {
    node.children = props.fallback
      ? normalizeChildren([props.fallback])._children
      : []

    Promise.all(
      children.map(content =>
        Promise.resolve(isFunction(content) ? content() : content)
      )
    ).then(_children => {
      if (e.id !== id) {
        return
      }

      const newVNode = {
        ...node,
        children: normalizeChildren(_children)._children
      }
      patchFragment({ ...context, oldVNode: node, newVNode })
      Object.assign(node, newVNode)
    })
  } else {
    node.children = normalizeChildren(children)._children
  }

  patchFragment(context)
}
