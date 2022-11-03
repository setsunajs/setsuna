import { Await } from "../components/Await"
import { Teleport } from "../components/Teleport"
import { Fragment } from "../components/Fragment"
import { isFunction, isString } from "@setsunajs/share"
import { unmountAwait } from "./patchOptions/await/unmountAwait"
import { unmountComponent } from "./patchOptions/component/unmountComponent"
import { ignoreElement } from "./patchOptions/element/ignoreElement"
import { unmountELement } from "./patchOptions/element/unmountElement"
import { unmountFragment } from "./patchOptions/fragment/unmountFragment"
import { unmountTeleport } from "./patchOptions/teleport/unmountTeleport"
import { unmountTextElement } from "./patchOptions/text/unmountTextElement"

export function unmount(node) {
  const { type } = node
  switch (type) {
    case Fragment:
      unmountFragment(node)
      break
    case "text":
      unmountTextElement(node)
      break
    case Teleport:
      unmountTeleport(node)
      break
    case Await:
      unmountAwait(node)
      break
    case "children":
      unmountFragment(node)
      break
    default: {
      if (isString(type) || ignoreElement.has(type)) {
        unmountELement(node)
      } else if (isFunction(type)) {
        unmountComponent(node)
      } else {
        throw `unmount error: 未知的卸载节点类型(${String(type)})`
      }
    }
  }
}
