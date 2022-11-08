import { resolveObservableState } from "@setsunajs/shared"
import { error } from "../../../handler/errorHandler"
import { ElementNode } from "../../../runtime.type"

export function setElementRef(e: ElementNode) {
  if (e.ref) {
    const input$ = (e.ref = resolveObservableState(e.ref))
    input$ ? input$.next(e.el) : error("Element", `ref is invalid`, [e.ref])
  }
}
