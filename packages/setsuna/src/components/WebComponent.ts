import { VNode } from "./../jsx"
import { nodeToString } from "../server/pipes/pipeNodeToString"
import { jsx } from "../jsx"
import { dom } from "../dom"
import { unmount } from "../patch/unmount"
import { hydrate, render } from "../render"
import { patch } from "../patch/patch"
import { SSRRenderContext } from "../server/pipes/pipeNormalizeRenderContext"
import { webCustomElement } from "../patch/patchOptions/element/webCustomElement"

const records = window.__SETSUNA_CUSTOM_ELEMENT__ || new Map()

let sid = 0
let rid = 0
export const isWebComponent = Symbol("setsuna web component")
export function defineElement<P = {}>(name: string, fc: Setsuna.FC<P>) {
  let record = records.get(name)
  if (record) {
    record.instance?.reload(fc)
    return { wrapper: (() => record.element) as () => Setsuna.FC<P> }
  }

  class TElement extends HTMLElement {
    static displayName = name
    static ssrRender({
      VNode: { props, children },
      parentComponent
    }: SSRRenderContext) {
      const tempBuf = nodeToString({
        VNode: jsx(fc, props),
        parentComponent: null
      })
      const tagBuf = nodeToString({
        VNode: jsx(name, Object.assign(props, { hydrate: true }), ...children),
        parentComponent
      })
      return [
        `<template component-name="${name}-${sid++}">`,
        tempBuf,
        "</template>",
        tagBuf
      ]
    }

    connected = false
    props: Record<any, any>
    shadow: ShadowRoot
    fc?: Setsuna.FC<any>
    _VNode?: VNode

    originGetAttribute?: Element["getAttribute"]
    originSetAttribute?: Element["setAttribute"]
    originRemoveAttribute?: Element["removeAttribute"]
    originAddEventListener?: Element["addEventListener"]
    originRemoveEventListener?: Element["removeEventListener"]

    constructor() {
      super()
      this.fc = fc
      this.props = {}
      this.shadow = this.attachShadow({ mode: "open" })
      this.initAttribute()
      this.initProxyMethod()

      initTemplateMap()
      record.instance = this
    }

    connectedCallback() {
      if (this.props.hydrate === "") {
        return
      }

      render((this._VNode = this._createVNode()), this.shadow)
      this.connected = true
    }

    hydrate() {
      this.shadow.innerHTML = templateMap.get(`${name}-${rid++}`)
      hydrate((this._VNode = this._createVNode()), this.shadow)
      return this.nextSibling
    }

    reload(fc: Setsuna.FC) {
      if (!this.connected) {
        return
      }
      unmount(this._VNode!)
      this.shadow.innerHTML = ""
      this.fc = fc
      render((this._VNode = this._createVNode()), this.shadow)
    }

    disconnectedCallback() {
      webCustomElement.delete(name)

      unmount(this._VNode!)
      this.shadow.innerHTML = ""
      this.connected = false
      this.props = {}
      this.getAttribute = this.originGetAttribute as any
      this.setAttribute = this.originSetAttribute as any
      this.removeAttribute = this.originRemoveAttribute as any
      this.addEventListener = this.originAddEventListener as any
      this.removeEventListener = this.originRemoveAttribute as any
      this.fc =
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
      if (value === this.props[key]) {
        return
      }

      if (typeof value === "number" || typeof value === "string") {
        this.originSetAttribute!(key, value)
      } else if (typeof value === "boolean") {
        value
          ? this.originSetAttribute!(key, "")
          : this.originRemoveAttribute!(key)
      } else {
        this.originRemoveAttribute!(key)
      }

      this.props[key] = value
      this._update()
    }

    _getAttribute(key: string) {
      return this.props[key]
    }

    _removeAttribute(key: string) {
      this.originRemoveAttribute!(key)
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
        this.fc!,
        new Proxy(this.props, {
          set(target, key, value, receiver) {
            if (!(key in target)) {
              return false
            }

            return Reflect.set(target, key, value, receiver)
          }
        })
      )
    }
  }

  webCustomElement.set(name, true)
  records.set(name, (record = { element: TElement }))
  customElements.define(name, TElement)

  return { wrapper: (() => record.element) as () => Setsuna.FC<P> }
}

let templateMap = new Map()
function initTemplateMap() {
  document.querySelectorAll("[component-name]").forEach(node => {
    if (node.nodeName === "TEMPLATE") {
      templateMap.set(node.getAttribute("component-name"), node.innerHTML)
      dom.removeElem(node)
    }
  })
}
