import { resolveObservableState } from "@setsunajs/shared"
import { ElementNode } from "./mountElement"
import { error } from "../../../handler/errorHandler"

export function setElementRef(e: ElementNode) {
  if (e.ref) {
    const input$ = (e.ref = resolveObservableState(e.ref))
    input$ ? input$.next(e.el) : error("Element ref", `ref is invalid`, [e.ref])
  }
}
