import { RenderCompEffectOptions, RenderComponentEffect, VNode } from "../../../runtime.type"
import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { postQueue } from "../../../scheduler"
import { isFunction } from "@setsunajs/shared"
import { patch } from "../../patch"
import { setCurrentInstance } from "./currentInstance"
import { dom } from "../../../dom"



export function createRenderComponentEffect(
  options: RenderCompEffectOptions | null
) {
  function renderComponentEffect() {
    let { c, deep, hydrateNode, hydrate } =
      renderComponentEffect as RenderComponentEffect
    const {
      render,
      mounted,
      updates,
      subTree: preSubTree,
      container,
      mounts,
      VNode
    } = c

    setCurrentInstance(c)
    const nextSubTree: VNode | null = callWithErrorHandler(VNode, render!)
    setCurrentInstance()

    if (mounted) {
      // use Lazy of setsuna-router will be null. skip the first
      if (!nextSubTree) return
      const updated = updates.map(updateFn => callWithErrorHandler(VNode, updateFn)).filter(Boolean)
      updated.length > 0 && postQueue.push({ VNode, fns: updated })

      patch({
        oldVNode: preSubTree,
        newVNode: (c.subTree = nextSubTree),
        container: container,
        anchor: VNode.anchor,
        parentComponent: c,
        deep
      })

      VNode.el = nextSubTree ? nextSubTree.el : null
    } else {
      let nextNode = hydrateNode

      if (nextSubTree) {
        nextNode = patch({
          oldVNode: null,
          newVNode: (c.subTree = nextSubTree),
          container,
          anchor: VNode.anchor,
          parentComponent: c,
          deep,
          hydrate,
          hydrateNode
        })
      }

      VNode.el = nextSubTree?.el
      VNode.anchor = nextSubTree ? dom.getNextSiblingNode(nextSubTree) : null
      Object.assign(renderComponentEffect, {
        hydrate: false,
        hydrateNode: null
      })
      Object.assign(c, {
        mounted: true,
        unmounts: mounts.map(fn => callWithErrorHandler(VNode, fn)).filter(Boolean)
      })

      return nextNode
    }
  }

  Object.assign(renderComponentEffect, options)
  options = null
  return renderComponentEffect as any as RenderComponentEffect
}
