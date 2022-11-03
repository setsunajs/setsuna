import { resolveObservableState } from "@setsunajs/share"

export function setElementRef(e) {
  if (!e.ref) {
    return
  }

  const input$ = (e.ref = resolveObservableState(e.ref))
  input$ ? input$.next(e.el) : error("Element", `不是合法 ref`, [ref])
}
