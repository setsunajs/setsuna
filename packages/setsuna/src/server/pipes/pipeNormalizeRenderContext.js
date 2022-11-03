import { isVNode } from "../../jsx"

export function pipeNormalizeRenderContext(VNode) {
  if (!isVNode(VNode)) {
    throw Error(
      `[renderToString error]: 该参数接收一个 VNode 节点，但却接到了`,
      VNode
    )
  }
  return { VNode, parentComponent: null }
}
