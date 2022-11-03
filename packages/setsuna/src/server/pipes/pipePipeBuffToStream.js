import { isArray, isPromise, isString } from "@setsunajs/share"

export const pipePipeBuffToStream = pipeBuffToStream

export function pipeBuffToStream(stream) {
  return async function _pipeBuffToStream(treeNodes) {
    for (const node of treeNodes) {
      if (isString(node)) {
        stream.push(node)
      } else if (isArray(node)) {
        await _pipeBuffToStream(node, stream)
      } else if (isPromise(node)) {
        const _node = await node
        await _pipeBuffToStream(_node)
      } else {
        error("hydrating", "未知的合并节点类型", [node])
      }
    }
  }
}
