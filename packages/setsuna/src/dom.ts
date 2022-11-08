import {
  query,
  removeAttr,
  removeEvent,
  setAttr,
  setEvent,
  insertElem,
  createElem,
  createTextElem,
  setElemText,
  removeElem,
  getNextSibling
} from "@setsunajs/shared"
import { Fragment } from "./components/Fragment"
import { VNode } from "./runtime.type"

export const dom = {
  insertElem,
  createElem,
  removeElem,
  createTextElem,
  setElemText,
  setAttr,
  removeAttr,
  setEvent,
  removeEvent,
  query,
  getNextSibling,
  getNextSiblingNode(node: VNode) {
    return node
      ? node.type === Fragment
        ? node.anchor
        : node.el
        ? getNextSibling(node.el)
        : null
      : null
  }
}
