import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { appendJob, postQueue } from "../../../scheduler"
import { isFunction } from "@setsunajs/share"
import { patch } from "../../patch"
import { setCurrentInstance } from "./currentInstance"
import { getNextSibling } from "../../../node/nodeOpts"

export function createRenderComponentEffect(options) {
  function renderComponentEffect() {
    const { c, anchor, deep } = renderComponentEffect
    let { hydrateNode, hydrate } = renderComponentEffect
    const {
      render,
      mounted,
      updates,
      subTree: preSubTree,
      container,
      deps,
      mounts,
      VNode
    } = c

    setCurrentInstance(c)
    const nextSubTree = callWithErrorHandler(VNode, render)
    setCurrentInstance(null)

    if (mounted) {
      const updated = { VNode, fns: [] }
      updates.forEach(updateFn => {
        const fn = callWithErrorHandler(VNode, updateFn)
        if (isFunction(fn)) {
          updated.fns.push(fn)
        }
      })
      updated.fns.length > 0 && postQueue.push(updated)

      patch({
        oldVNode: preSubTree,
        newVNode: (c.subTree = nextSubTree),
        container: container,
        anchor,
        parentComponent: c,
        deep
      })

      const invalid = []
      deps.forEach(u => (u.active ? appendJob(u) : invalid.push(u)))
      invalid.forEach(u => deps.delete(u))

      VNode.el = nextSubTree ? nextSubTree.el : null
    } else {
      let nextNode = hydrateNode

      if (nextSubTree !== null) {
        nextNode = patch({
          oldVNode: null,
          newVNode: (c.subTree = nextSubTree),
          container,
          anchor,
          parentComponent: c,
          deep,
          hydrate,
          hydrateNode
        })
      }

      VNode.el = nextSubTree?.el
      VNode.anchor = nextSubTree ? getNextSibling(nextSubTree) : null
      Object.assign(c, {
        mounted: true,
        unmounts: mounts.map(fn => callWithErrorHandler(VNode, fn))
      })
      Object.assign(renderComponentEffect, {
        hydrate: false,
        hydrateNode: null
      })

      return nextNode
    }
  }

  Object.assign(renderComponentEffect, options)
  options = null
  return renderComponentEffect
}
