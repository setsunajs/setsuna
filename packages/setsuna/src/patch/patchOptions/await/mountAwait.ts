import { normalizeChildren } from "../../../jsx"
import { isFunction, isPromise } from "@setsunajs/shared"
import { patchFragment } from "../fragment/patchFragment"
import { PatchContext } from "../../patch"
import { AwaitNode } from "../patchNodeTypes"

export function mountAwait(context: PatchContext) {
  const node = context.newVNode!
  const { props, children } = node
  const awaitNode: AwaitNode = { id: 0 }
  const n = node._n || (node._n = awaitNode)

  if (children.some(content => isFunction(content) || isPromise(content))) {
    node.children = props.fallback ? normalizeChildren([props.fallback]) : []

    Promise.all(
      children.map(content =>
        Promise.resolve(isFunction(content) ? content() : content)
      )
    ).then(_children => {
      if (n.id !== 0) return

      const newChildren = normalizeChildren(_children)
      patchFragment({
        ...context,
        oldVNode: node,
        newVNode: { ...node, children: newChildren }
      })
      node.children = newChildren
    })
  } else {
    node.children = normalizeChildren(children)
  }

  patchFragment(context)
}
