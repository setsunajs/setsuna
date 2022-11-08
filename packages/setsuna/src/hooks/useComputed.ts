import { Observable, ObservablePipeOperator } from "@setsunajs/observable"
import { isFunction, isPlainObject } from "@setsunajs/shared"
import { error } from "../handler/errorHandler"
import { ComputedOptions, HookState } from "../runtime.type"
import { createState } from "./createState"
import { useEffect } from "./useEffect"

export function useComputed<T>(
  observables: Array<Observable<T> | HookState<T>>,
  options: ComputedOptions<T>,
  pipes: ObservablePipeOperator<T, T>[] = []
) {
  let getter = () => {
    return error("hook-useComputed", "get failed, getter is undefined")
  }
  let setter = () => {
    return error("hook-useComputed", "set failed, setter is undefined")
  }

  if (isFunction(options)) {
    getter = options
  } else if (isPlainObject(options)) {
    isFunction(options.get) && (getter = options.get)
    isFunction(options.set) && (setter = options.set)
  }

  const [state, setState] = createState<T>({ value: getter() as any, pipes })
  useEffect(observables, () => {
    setter()
    setState(getter() as any)
  })

  return [state, setter]
}
