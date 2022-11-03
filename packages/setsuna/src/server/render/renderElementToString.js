import {
  isFunction,
  omit,
  resolveObservableState,
  normalizeElementProps
} from "@setsunajs/share"
import { nodeToString } from "../pipes/pipeNodeToString"

export function renderElementToString({ VNode, parentComponent }) {
  const { type, props, children } = VNode
  return [
    `<${type}`,
    renderElementAttrsToString(normalizeElementProps(omit(props, "ref"))),
    ">",
    children.map(VNode => nodeToString({ VNode, parentComponent })),
    `</${type}>`
  ]
}

export function renderElementAttrsToString(attrs) {
  let attrStr = ""
  for (const [key, value] of Object.entries(attrs)) {
    const input$ = resolveObservableState(value)

    if (input$) {
      attrStr += ` ${key}="Observable<${value()}>"`
    } else if (value === true) {
      attrStr += ` ${key}`
    } else if (key.startsWith("on") && isFunction(value)) {
    } else {
      attrStr += ` ${key}="${value}"`
    }
  }
  attrStr = attrStr.trim()
  return attrStr.length > 0 ? ` ${attrStr}` : ""
}
