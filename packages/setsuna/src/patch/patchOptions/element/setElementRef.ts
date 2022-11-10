import { resolveObservableState } from "@setsunajs/shared"
import { error } from "../../../handler/errorHandler"
import { ElementNode } from "../../../runtime.type"

export function setElementRef({ ref }: Record<any, any>, e: ElementNode) {
  if (ref) {
    const input$ = resolveObservableState(ref)
    if (!input$) {
      return error("Element", `ref is invalid`, [ref])
    }

    input$.next(e.el)
    e.ref = input$
  }
}
