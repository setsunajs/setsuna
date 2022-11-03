import { svgTags } from "@setsunajs/share"
import { Fragment } from "../components/Fragment"

export function insertElement(child, parent, anchor) {
  return parent.insertBefore(child, anchor)
}

export function removeElement(el) {
  return el.parentNode.removeChild(el)
}

export function createTextElement(text) {
  return document.createTextNode(text)
}

export function createElement(tag, attrs) {
  return svgTags[tag]
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag, attrs.is)
}

export function getNextSibling(node) {
  return node
    ? node.type === Fragment
      ? node.anchor
      : node.el
      ? getElementNextSibling(node.el)
      : null
    : null
}

export function getElementNextSibling(el) {
  return el.nextSibling
}

export function setTextContent(el, text) {
  return (el.textContent = text)
}

export function setAttr(el, key, value) {
  return key === "value" ? (el.value = value) : el.setAttribute(key, value)
}

export function removeAttr(el, key) {
  return el.removeAttribute(key)
}

export function setEvent(el, type, event, options) {
  return el.addEventListener(type, event, options)
}

export function removeEvent(el, type, event, options) {
  return el.removeEventListener(type, event, options)
}

export function querySelector(sel) {
  return document.querySelector(sel)
}
