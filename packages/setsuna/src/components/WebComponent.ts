import { jsx } from "../jsx"
import { unmount } from "../patch/unmount"
import { render } from "../render"
import { patch } from "../patch/patch"
import { webCustomElement } from "../patch/patchOptions/element/webCustomElement"
import { FC, VNode } from "../runtime.type"
import { isFunction, isString } from "@setsunajs/shared"

const records: Map<
  string,
  {
    fc: FC<any>
    deps: Set<{ instance: any }>
  }
> = window.__SETSUNA_CUSTOM_ELEMENT__ || new Map()

export const isWebComponent = (value: unknown) => {
  if (isString(value)) {
    return records.has(value)
  } else if (isFunction(value)) {
    for (const name of records.keys()) {
      if (name === value.name) return true
    }
    return false
  } else {
    return false
  }
}

export function defineElement<P = {}>(name: string, fc: FC<P>) {
  let record = records.get(name)
  if (record) {
    record.fc = fc
    record.deps.forEach(item => item.instance.reload())
    return { wrapper: (() => name) as any as () => FC<P> }
  }

  class TElement extends HTMLElement {
    // static ssrRender({
    //   VNode: { props, children },
    //   parentComponent
    // }: SSRRenderContext) {
    //   const tempBuf = nodeToString({
    //     VNode: jsx(fc, props),
    //     parentComponent: null
    //   })
    //   const tagBuf = nodeToString({
    //     VNode: jsx(name, Object.assign(props, { hydrate: true }), ...children),
    //     parentComponent
    //   })
    //   return [
    //     `<template component-name="${name}-${sid++}">`,
    //     tempBuf,
    //     "</template>",
    //     tagBuf
    //   ]
    // }

    props: Record<any, any> = {}
    shadow: ShadowRoot = this.attachShadow({ mode: "open" })
    connected = false
    _VNode?: VNode
    _record = { instance: this }

    originGetAttribute?: Element["getAttribute"]
    originSetAttribute?: Element["setAttribute"]
    originRemoveAttribute?: Element["removeAttribute"]
    originAddEventListener?: Element["addEventListener"]
    originRemoveEventListener?: Element["removeEventListener"]

    constructor() {
      super()
      this.initAttribute()
      this.initProxyMethod()
      record!.deps.add(this._record)
      // initTemplateMap()
    }

    connectedCallback() {
      if (this.props.hydrate === "") {
        return
      }

      render((this._VNode = this._createVNode()), this.shadow)
      this.connected = true
    }

    reload() {
      if (!this.connected) {
        return
      }

      unmount(this._VNode!)
      this.shadow.innerHTML = ""

      this.initAttribute()
      this.initProxyMethod()
      render((this._VNode = this._createVNode()), this.shadow)
    }

    disconnectedCallback() {
      webCustomElement.delete(name)
      record!.deps.delete(this._record)

      unmount(this._VNode!)
      this.shadow.innerHTML = ""
      this.connected = false
      this.props = {}
      this.getAttribute = this.originGetAttribute as any
      this.setAttribute = this.originSetAttribute as any
      this.removeAttribute = this.originRemoveAttribute as any
      this.addEventListener = this.originAddEventListener as any
      this.removeEventListener = this.originRemoveAttribute as any
      this.originGetAttribute =
        this.originSetAttribute =
        this.originRemoveAttribute =
          void 0
    }

    initProxyMethod() {
      this.originGetAttribute = this.getAttribute
      this.getAttribute = this._getAttribute

      this.originSetAttribute = this.setAttribute
      this.setAttribute = this._setAttribute

      this.originRemoveAttribute = this.removeAttribute
      this.removeAttribute = this._removeAttribute

      this.originAddEventListener = this.addEventListener
      this.addEventListener = this._setAttribute as any

      this.originRemoveEventListener = this.removeEventListener
      this.removeEventListener = this._removeAttribute
    }

    initAttribute() {
      this.getAttributeNames().forEach(key => {
        const value = this.getAttribute(key)
        if (value === "" || value === "true") {
          this.props[key] = ""
          this.setAttribute(key, "")
          return
        }

        const _value = Number(value)
        this.props[key] = Number.isNaN(_value) ? value : _value
      })
    }

    _setAttribute(key: string, value: string) {
      if (Object.is(value, this.props[key])) {
        return
      }

      this.props[key] = value
      this._update()
    }

    _getAttribute(key: string) {
      return this.props[key]
    }

    _removeAttribute(key: string) {
      this.props[key] = void 0
      this._update()
    }

    _update() {
      if (!this.connected) {
        return
      }

      const newVNode = this._createVNode()
      const oldVNode = this._VNode!
      patch({
        oldVNode,
        newVNode,
        container: this.shadow,
        anchor: null,
        parentComponent: null,
        deep: false
      })
      this._VNode = newVNode
    }

    _createVNode() {
      return jsx(
        record!.fc,
        new Proxy(this.props, {
          set(target, key, value, receiver) {
            if (!Reflect.has(target, key)) {
              return false
            }

            return Reflect.set(target, key, value, receiver)
          }
        })
      )
    }
  }

  records.set(name, (record = { fc, deps: new Set() }))
  webCustomElement.set(name, true)
  customElements.define(name, TElement)
  return { wrapper: (() => name) as any as () => FC<P> }
}
