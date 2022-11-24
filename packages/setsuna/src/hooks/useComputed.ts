import { Observable, ObservablePipeOperator } from "@setsunajs/observable"
import { isFunction, isPlainObject } from "@setsunajs/shared"
import { error } from "../handler/errorHandler"
import { ComputedOptions, HookState, PickRawState } from "../runtime.type"
import { createState } from "./createState"
import { useEffect } from "./useEffect"

export function useComputed<T, S = PickRawState<T>>(
  observables: Array<Observable<T> | HookState<T>>,
  options: ComputedOptions<T, S>,
  pipes: ObservablePipeOperator<T, T>[] = []
) {
  let getter = () => {
    return error("hook-useComputed", "get failed, getter is undefined")
  }
  let setter = (value: S) => {
    return error("hook-useComputed", "set failed, setter is undefined")
  }

  if (isFunction(options)) {
    getter = options
  } else if (isPlainObject(options)) {
    isFunction(options.get) && (getter = options.get)
    isFunction(options.set) && (setter = options.set as any)
  }

  const [state, setState] = createState<T>({ value: getter() as any, pipes })
  useEffect(observables, () => setState(getter() as any))

  return [state, setter] as const
}
