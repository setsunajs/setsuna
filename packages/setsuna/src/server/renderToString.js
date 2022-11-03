import { pipeNormalizeRenderContext } from "./pipes/pipeNormalizeRenderContext"
import { pipeNodeToString } from "./pipes/pipeNodeToString"
import { pipeMergeBuffNodes } from "./pipes/pipeMergeBuffNodes"
import { defineLazyObservable } from "@setsunajs/observable"

export function renderToString() {
  return defineLazyObservable().pipe(
    pipeNormalizeRenderContext,
    pipeNodeToString,
    pipeMergeBuffNodes
  )
}
