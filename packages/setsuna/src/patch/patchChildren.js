import { getNextSibling, insertElement } from "../dom"
import { isSomeVNode, isUndefined } from "@setsunajs/share"
import { patch } from "./patch"
import { unmount } from "./unmount"

export function mountChildren(children, options) {
  const size = children.length
  if (size === 0) {
    return
  }

  for (let i = 0; i < size; i++) {
    patch({ ...options, newVNode: children[i] })
  }
}

export function hydrateChildren(children, options) {
  const size = children.length
  if (size === 0) {
    return null
  }

  let hydrateNode = options.hydrateNode ?? options.container.firstChild
  for (let i = 0; i < children.length; i++) {
    hydrateNode = patch({ ...options, hydrateNode, newVNode: children[i] })
  }

  return hydrateNode
}

export function patchChildren(
  oldChildren,
  newChildren,
  { container, anchor, ...rest }
) {
  let s1 = 0
  let e1 = oldChildren.length - 1

  let s2 = 0
  let e2 = newChildren.length - 1

  let oldKeyMap = null

  while (s1 <= e1 && s2 <= e2) {
    const sNode1 = oldChildren[s1]
    const eNode1 = oldChildren[e1]

    const sNode2 = newChildren[s2]
    const eNode2 = newChildren[e2]

    if (sNode1 === null) {
      s1++
    } else if (eNode1 === null) {
      e1--
    } else if (isSomeVNode(sNode1, sNode2)) {
      patch({
        ...rest,
        oldVNode: sNode1,
        newVNode: sNode2,
        container,
        anchor
      })
      s1++
      s2++
    } else if (isSomeVNode(eNode1, eNode2)) {
      patch({
        ...rest,
        oldVNode: eNode1,
        newVNode: eNode2,
        container,
        anchor
      })
      e1--
      e2--
    } else if (isSomeVNode(sNode1, eNode2)) {
      patch({
        ...rest,
        oldVNode: sNode1,
        newVNode: eNode2,
        container,
        anchor
      })
      insertElement(eNode2.el, container, getNextSibling(eNode1))
      s1++
      e2--
    } else if (isSomeVNode(eNode1, sNode2)) {
      patch({
        ...rest,
        oldVNode: eNode1,
        newVNode: sNode2,
        container,
        anchor
      })
      insertElement(sNode2.el, container, sNode1.el)
      s2++
      e1--
    } else {
      if (!oldKeyMap) {
        oldKeyMap = new Map()
        oldChildren.forEach((item, index) => {
          if (
            item.key !== undefined &&
            item.key !== null &&
            !Number.isNaN(item.key)
          ) {
            oldKeyMap.set(item.key, index)
          }
        })
      }

      const index = isUndefined(sNode2.key)
        ? findOldIndex(sNode2, oldChildren, s1, e1)
        : oldKeyMap.get(sNode2.key)

      if (isUndefined(index)) {
        patch({
          ...rest,
          oldVNode: null,
          newVNode: sNode2,
          container,
          anchor: sNode1.el
        })
      } else {
        const oNode = oldChildren[index]
        if (isSomeVNode(oNode, sNode2)) {
          patch({
            ...rest,
            oldVNode: oNode,
            newVNode: sNode2,
            container,
            anchor: sNode1.el
          })
          insertElement(sNode2.el, container, sNode1.el)
          oldChildren[index] = null
        } else {
          patch({
            ...rest,
            oldVNode: null,
            newVNode: sNode2,
            container,
            anchor: getNextSibling(oNode)
          })
          unmount(oNode)
        }
      }
      s2++
    }
  }

  // 旧的更新完 && 新的尚未更新完
  if (s1 > e1 && s2 <= e2) {
    for (let i = s2; i <= e2; i++) {
      const node = newChildren[i]
      patch({
        ...rest,
        oldVNode: null,
        newVNode: node,
        container,
        anchor: isUndefined(newChildren[e2 + 1]) ? null : newChildren[e2 + 1].el
      })
    }
  }
  // 新的更新完 && 旧的尚未更新完
  else if (s2 > e2 && s1 <= e1) {
    for (let i = s1; i <= e1; i++) {
      const node = oldChildren[i]
      node && unmount(node)
    }
  }
}

function findOldIndex(n, children, start, end) {
  for (let index = start; index <= end; index++) {
    const _n = children[index]
    if (_n !== null && n.type === _n.type) {
      return index
    }
  }
}
