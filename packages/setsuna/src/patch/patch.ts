import { Await } from "../components/Await"
import { Fragment } from "../components/Fragment"
import { Teleport } from "../components/Teleport"
import { isFunction, isSomeVNode, isString } from "@setsunajs/shared"
import { patchAwait } from "./patchOptions/await/patchAwait"
import { patchSlot } from "./patchOptions/component/children"
import { patchComponent } from "./patchOptions/component/patchComponent"
import { patchElement } from "./patchOptions/element/patchElement"
import { patchFragment } from "./patchOptions/fragment/patchFragment"
import { patchTeleport } from "./patchOptions/teleport/patchTeleport"
import { patchTextElement } from "./patchOptions/text/patchTextElement"
import { unmount } from "./unmount"
import { error } from "../handler/errorHandler"
import { PatchContext } from "../runtime.type"

export function patch(patchContext: PatchContext) {
  const { oldVNode, newVNode } = patchContext

  if (Object.is(oldVNode, newVNode)) {
    return
  }

  if (oldVNode && !isSomeVNode(oldVNode, newVNode!)) {
    patchContext.anchor = oldVNode.anchor
    unmount(oldVNode)
    patchContext.oldVNode = null
  }

  const type = newVNode!.type
  switch (type) {
    case Fragment:
      return patchFragment(patchContext)
    case "text":
      return patchTextElement(patchContext)
    case Teleport:
      return patchTeleport(patchContext)
    case Await:
      return patchAwait(patchContext)
    case "children":
      return patchSlot(patchContext)
    default: {
      if (isString(type)) {
        return patchElement(patchContext)
      } else if (isFunction(type)) {
        return patchComponent(patchContext)
      } else {
        throw error("path", "unknown VNode type", [type])
      }
    }
  }
}
