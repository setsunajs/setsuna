import { renderFragmentToString } from "./renderFragmentToString"

export function renderChildrenToString({ VNode, parentComponent }) {
  VNode.children = parentComponent.slot
  return renderFragmentToString({ VNode, parentComponent })
}
