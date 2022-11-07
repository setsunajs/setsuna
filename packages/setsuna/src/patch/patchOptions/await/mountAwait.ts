import { VNode } from "./../../../jsx"
import { normalizeChildren } from "../../../jsx"
import { isFunction, isPromise } from "@setsunajs/shared"
import { patchFragment } from "../fragment/patchFragment"
import { PatchContext } from "../../patch"
import { AwaitNode } from "../patchNodeTypes"


export function mountAwait(context: PatchContext) {
  const node = context.newVNode!
  const { props, children } = node
  const hasAsync = children.some(
    content => isFunction(content) || isPromise(content)
  )
  const awaitNode: AwaitNode = { id: 0, VNode: node }
  const e = node._n || (node._n = awaitNode)
  const id = e.id

  if (hasAsync) {
    node.children = props.fallback ? normalizeChildren([props.fallback]) : []

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
        children: normalizeChildren(_children)
      }
      patchFragment({ ...context, oldVNode: node, newVNode })
      Object.assign(node, newVNode)
    })
  } else {
    node.children = normalizeChildren(children)
  }

  patchFragment(context)
}
