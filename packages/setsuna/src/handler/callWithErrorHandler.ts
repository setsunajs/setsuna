import { VNode } from "./../jsx"
import { error } from "./errorHandler"

export function callWithErrorHandler(
  VNode: null | VNode,
  fn: (...args: any[]) => any,
  arg: any
) {
  try {
    return fn(arg)
  } catch (e) {
    if (!VNode) {
      return error(e as string)
    }

    let c = VNode._c
    const errorTask = [`\n<${c.FC.name}>`]

    while (c.parentComponent) {
      c = c.parentComponent
      errorTask.push(`\n<${c.FC.name}>`)
    }
    error(
      "flushing",
      e instanceof Error
        ? `${e.name}${e.stack ? `: ${e.stack}` : ""}`
        : (e as string),
      errorTask
    )
  }
}
