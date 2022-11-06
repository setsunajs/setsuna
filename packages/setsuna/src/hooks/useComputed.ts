import { Observable, ObservablePipeOperator } from "@setsunajs/observable"
import { isFunction, isPlainObject } from "@setsunajs/shared"
import { error } from "../handler/errorHandler"
import { HookState, createState } from "./createState"
import { useEffect } from "./useEffect"

export type ComputedOptions<T> =
  | (() => T)
  | {
      get: () => Array<Observable<T> | HookState<T>>
      set?: () => void
    }
export function useComputed<T>(
  observables: Array<Observable<T> | HookState<T>>,
  options: ComputedOptions<T>,
  pipes: ObservablePipeOperator<T, T>[] = []
) {
  let getter = () => {
    return error("hook-useComputed", "getter is undefined")
  }
  let setter = () => {
    return error("hook-useComputed", "setter is undefined")
  }

  if (isFunction(options)) {
    getter = options
  } else if (isPlainObject(options)) {
    isFunction(options.get) && (getter = options.get)
    isFunction(options.set) && (setter = options.set)
  }

  const [_, setState] = createState<T>({ value: 0 as any, pipes })
  useEffect(observables, () => {
    setter()
    setState(Math.random() as any)
  })

  return [getter, setter]
}
