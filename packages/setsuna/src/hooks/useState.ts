import { ObservablePipeOperator } from "@setsunajs/observable"
import { createState } from "./createState"

export function useState<T>(
  value: T,
  pipes: ObservablePipeOperator<T, T>[]
) {
  return createState({ value, pipes })
}
