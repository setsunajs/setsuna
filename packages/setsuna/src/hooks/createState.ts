import { createObservable, ObservablePipeOperator } from "@setsunajs/observable"
import { resolveObservableState, isArray } from "@setsunajs/shared"
import { error } from "../handler/errorHandler"
import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"
import { ComponentContextKey } from "../patch/patchOptions/component/mountComponent"

type Options<T> = {
  value: T
  pipes: ObservablePipeOperator<T, T>[]
  needObserver?: boolean
  key?: ComponentContextKey
  deep?: boolean
}

export type HookState<T> = () => T
export type HookSetState<T> = (newState: T) => T

export function createState<T>({
  value,
  pipes = [],
  needObserver = true,
  deep = false,
  key
}: Options<T>) {
  if (!isArray(pipes)) {
    pipes = []
    error("hook", "invalid pipes param, expected 'Array' but got", [pipes])
  }

  const input$ = createObservable<T>(resolveObservableState(value))
  input$.pipe.apply(null, pipes as any)

  const originContext = getCurrentInstance()
  if (needObserver && originContext) {
    deep
      ? (originContext.context[key!] = input$)
      : originContext.observable.push(input$)
  }

  const state = () => {
    const activeContext = getCurrentInstance()
    if (needObserver && originContext !== activeContext && !deep) {
      originContext.deps.add(activeContext.VNode.update!)
    }

    return input$.value
  }
  const setState = (nValue: T) => input$.next(nValue)

  return [state, setState] as [HookState<T>, HookSetState<T>]
}
