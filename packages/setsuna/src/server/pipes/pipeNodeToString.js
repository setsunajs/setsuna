import { isFunction, isString } from "@setsunajs/share"
import { renderAwaitToString } from "../render/renderAwaitToString"
import { renderChildrenToString } from "../render/renderChildrenToString"
import { renderComponentToString } from "../render/renderComponentToString"
import { renderElementToString } from "../render/renderElementToString"
import { renderFragmentToString } from "../render/renderFragmentToString"
import { renderTextElementToString } from "../render/renderTextElementToString"
import { Await } from "../../components/Await"
import { Fragment } from "../../components/Fragment"
import { Teleport } from "../../components/Teleport"
import { ignoreElement } from "../../patch/patchOptions/element/ignoreElement"

export function nodeToString(renderContext) {
  const type = renderContext.VNode.type

  if (type === Fragment) {
    return renderFragmentToString(renderContext)
  } else if (type === "children") {
    return renderChildrenToString(renderContext)
  } else if (type === Teleport) {
    throw Error(
      "[renderTeleportToString error]: 服务端不支持teleport的服务端渲染"
    )
  } else if (type === Await) {
    return renderAwaitToString(renderContext)
  } else if (type === "text") {
    return renderTextElementToString(renderContext)
  } else if (isString(type)) {
    return renderElementToString(renderContext)
  } else if (ignoreElement.has(type)) {
    return type.ssrRender(renderContext)
  }
  if (isFunction(type)) {
    return renderComponentToString(renderContext)
  } else {
    throw `patch error: 未识别的类型(${String(type)})`
  }
}

export const pipeNodeToString = nodeToString
