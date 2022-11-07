import Setsuna from "packages/setsuna/jsx"
import type { VNode } from "../../jsx"
import { isVNode } from "../../jsx"

export type SSRRenderContext = {
  VNode: VNode
  parentComponent: null | Setsuna.FC
}
export function pipeNormalizeRenderContext(VNode: VNode) {
  if (!isVNode(VNode)) {
    throw Error(
      `[renderToString error]: 该参数接收一个 VNode 节点，但却接到了`,
      VNode
    )
  }
  return { VNode, parentComponent: null }
}
