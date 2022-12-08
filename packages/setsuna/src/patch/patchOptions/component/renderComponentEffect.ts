import {
  RenderCompEffectOptions,
  RenderComponentEffect,
  VNode
} from "../../../runtime.type"
import { callWithErrorHandler } from "../../../handler/callWithErrorHandler"
import { postQueue } from "../../../scheduler"
import { patch } from "../../patch"
import { setCurrentInstance } from "./currentInstance"
import { dom } from "../../../dom"
import { isVNode, jsx } from "../../../jsx"
import { error } from "../../../handler/errorHandler"
import { isFunction } from "@setsunajs/shared"

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
    const nextSubTree = normalizeSubTree(callWithErrorHandler(VNode, render!))
    setCurrentInstance()

    if (mounted) {
      const updated = updates
        .map(updateFn => callWithErrorHandler(VNode, updateFn))
        .filter(isFunction)
      updated.length > 0 && postQueue.push({ VNode, fns: updated as any })

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

      VNode.el = nextSubTree?.el
      VNode.anchor = nextSubTree ? dom.getNextSiblingNode(nextSubTree) : null
      Object.assign(renderComponentEffect, {
        hydrate: false,
        hydrateNode: null
      })
      Object.assign(c, {
        mounted: true,
        unmounts: mounts
          .map(fn => callWithErrorHandler(VNode, fn))
          .filter(isFunction)
      })

      return nextNode
    }
  }

  Object.assign(renderComponentEffect, options)
  options = null
  return renderComponentEffect as any as RenderComponentEffect
}

function normalizeSubTree(value: unknown) {
  if (value === null) return jsx("text", {}, "")
  if (isVNode(value)) return value

  error("component", "update `VNode` is invalid", [value])
  return jsx("text", {}, "")
}
