import { error } from "./errorHandler"

export function callWithErrorHandler(VNode, fn, arg) {
  try {
    return fn(arg)
  } catch (e) {
    if (!VNode) {
      error(e)
    }

    let c = VNode._c
    const errorTask = [`\n<${c.FC.name}>`]

    while (c.parentComponent) {
      c = c.parentComponent
      errorTask.push(`\n<${c.FC.name}>`)
    }
    error(
      "flushing",
      e instanceof Error ? `${e.name}: ${e.stack}` : e,
      errorTask
    )
  }
}
