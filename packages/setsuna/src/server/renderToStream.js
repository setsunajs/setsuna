import { pipeNodeToString } from "./pipes/pipeNodeToString"
import { pipeNormalizeRenderContext } from "./pipes/pipeNormalizeRenderContext"
import { pipePipeBuffToStream } from "./pipes/pipePipeBuffToStream"
import { defineLazyObservable } from "@setsunajs/observable"

export function renderToStream(stream, pipes = []) {
  return defineLazyObservable().pipe(
    pipeNormalizeRenderContext,
    pipeNodeToString,
    pipePipeBuffToStream(stream),
    ...pipes,
    () => stream.push(null)
  )
}
