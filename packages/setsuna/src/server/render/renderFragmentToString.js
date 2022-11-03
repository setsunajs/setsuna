import { nodeToString } from "../pipes/pipeNodeToString"

export function renderFragmentToString({
  VNode: { children },
  parentComponent
}) {
  return [
    "<!-- Fragment -->",
    children.map(VNode => nodeToString({ VNode, parentComponent }))
    // "<!-- /Fragment -->"
  ]
}
