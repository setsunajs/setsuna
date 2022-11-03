import { isArray, isPromise, isString } from "@setsunajs/share"
import { error } from "../../handler/errorHandler"

export const pipeMergeBuffNodes = mergeBuffNodes

export async function mergeBuffNodes(treeNodes) {
  let buff = ""
  for (const node of treeNodes) {
    if (isString(node)) {
      buff += node
    } else if (isArray(node)) {
      buff += await mergeBuffNodes(node)
    } else if (isPromise(node)) {
      const _node = await node
      buff += await mergeBuffNodes(_node)
    } else {
      error("hydrating", "未知的合并节点类型", [node])
    }
  }
  return buff
}
