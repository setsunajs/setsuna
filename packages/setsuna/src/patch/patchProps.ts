import { dom } from "../dom"
import {
  resolveJsxEventName,
  resolveObservableState,
  isBoolean,
  isFunction
} from "@setsunajs/shared"
import { error } from "../handler/errorHandler"
import { effectState } from "./patchOptions/component/effectState"

const patchedValue = Symbol("patchedValue")
export function patchProps(
  el: Element,
  newProps: Record<any, any>,
  oldProps: Record<any, any>
) {
  newProps = { ...newProps }
  oldProps = { ...oldProps }

  if (Object.is(newProps, oldProps)) {
    return
  }

  for (const key in newProps) {
    let nValue = newProps[key]
    let oValue = oldProps[key]

    if (resolveObservableState(nValue)) {
      nValue = nValue()
    }

    if (resolveObservableState(oValue)) {
      oValue = effectState.get(oValue.input$)
    }

    if (Object.is(nValue, oValue)) {
      oldProps[key] = patchedValue
      continue
    }

    if (isFunction(oValue)) {
      const eventName = resolveJsxEventName(key)
      if (eventName) {
        dom.removeEvent(el, eventName, oValue)
        oldProps[key] = patchedValue
      }
    }

    if (isBoolean(nValue)) {
      dom.setAttr(el, key, nValue ? "" : nValue)
    } else if (!isFunction(nValue)) {
      dom.setAttr(el, key, nValue)
    } else {
      const eventName = resolveJsxEventName(key)
      eventName
        ? dom.setEvent(el, key, nValue)
        : dom.setAttr(el, key, nValue + "")
    }

    oldProps[key] = patchedValue
  }

  for (const key in oldProps) {
    const value = oldProps[key]
    if (value === patchedValue) {
      continue
    }

    if (!isFunction(value)) {
      dom.removeAttr(el, key)
      continue
    }

    const eventName = resolveJsxEventName(key)
    dom.removeEvent(el, eventName || key, value)
  }
}

const regReactiveAttr = /^Ob<(.*?)>$/
export function hydrateProps(el: Element, attrs: Record<any, any>) {
  el.getAttributeNames().forEach(key => {
    const attr = attrs[key]
    let realAttr = el.getAttribute(key)!

    if (!attr) {
      error(
        "hydrating attrs",
        `attr mismatch, expect '' but matched '${realAttr}'`
      )
      attrs[key] = patchedValue
      dom.removeAttr(el, key)
      return
    }

    const reactive = realAttr.match(regReactiveAttr)
    if (reactive) {
      realAttr = reactive[0]
    }

    if (!isBoolean(attr) && attr + "" != realAttr) {
      error("hydrating attrs", `attr mismatch, expect '${attr}' but matched '${realAttr}'`)
      dom.setAttr(el, key, attr)
    }

    attrs[key] = patchedValue
  })

  Object.keys(attrs).forEach(key => {
    const attr = attrs[key]
    if (attr === patchedValue) {
      return
    }

    if (isFunction(attr)) {
      const eventName = resolveJsxEventName(key)
      dom.setEvent(el, eventName || key, attr)
    } else {
      error("hydrating attrs", `attr mismatch, expect '${attr}' but matched 'null'`)
      dom.setAttr(el, key, attr)
    }
  })
}
