import { removeAttr, removeEvent, setAttr, setEvent } from "../node/nodeOpts"
import { resolveEventName } from "@setsunajs/share"
import { resolveObservableState } from "@setsunajs/share"
import { isBoolean, isFunction } from "@setsunajs/share"
import { error } from "../handler/errorHandler"

const patchedValue = Symbol("patchedValue")
export function patchProps(el, newProps, oldProps) {
  oldProps = { ...oldProps }
  newProps = { ...newProps }
  if (oldProps === newProps) {
    return
  }

  for (const key in newProps) {
    let nValue = newProps[key]
    let oValue = oldProps[key]

    if (Object.is(oValue, nValue)) {
      if (resolveObservableState(nValue) !== undefined) {
        nValue = nValue()
      }
      if (resolveObservableState(oValue) !== undefined) {
        oValue = oValue.state
      }
      if (Object.is(oValue, nValue)) {
        oldProps[key] = patchedValue
        continue
      }
    }

    if (resolveObservableState(nValue)) {
      nValue = nValue()
    }

    if (isFunction(oValue)) {
      removeEvent(el, resolveEventName(key), oValue)
      oldProps[key] = patchedValue
    }

    if (isFunction(nValue)) {
      setEvent(el, resolveEventName(key), nValue)
    } else if (isBoolean(nValue)) {
      setAttr(el, key, nValue ? "" : nValue)
    } else {
      setAttr(el, key, nValue)
    }
    oldProps[key] = patchedValue
  }

  for (const key in oldProps) {
    const value = oldProps[key]
    if (value === patchedValue) {
      continue
    }

    isFunction(value)
      ? removeEvent(el, resolveEventName(key), value)
      : removeAttr(el, key)
  }
}

export function hydrateProps(el, attrs) {
  el.getAttributeNames().forEach(key => {
    const attr = attrs[key]
    if (!attr) {
      error("hydrating attrs", "缺少属性", [key])
      attrs[key] = patchedValue
      removeAttr(el, key)
      return
    }

    let _attr = el.getAttribute(key)
    const reactive = _attr ? _attr.match("Observable<(.*?)>") : null
    if (reactive !== null) {
      _attr = reactive[0]
    }
    if (!isBoolean(attr) && attr != _attr) {
      error("hydrating attrs", "属性值对不上", [_attr, " ", attr])
      setAttr(el, key, attr)
    }
    attrs[key] = patchedValue
  })

  Object.keys(attrs).forEach(key => {
    const attr = attrs[key]
    if (attr === patchedValue) {
      return
    }

    if (isFunction(attr)) {
      setEvent(el, resolveEventName(key), attr)
    } else {
      error("hydrating attrs", "属性值对不上", [attr])
      setAttr(el, key, attr)
    }
  })
}
