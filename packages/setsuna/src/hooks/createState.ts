import {
  createObservable,
  Observable,
  ObservablePipeOperator,
  OB_FLAG
} from "@setsunajs/observable"
import { resolveObservableState, isArray, def } from "@setsunajs/shared"
import { error } from "../handler/errorHandler"
import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"
import { effectState } from "../patch/patchOptions/component/effectState"
import { HookSetState, HookState, Key } from "../runtime.type"

type Options<T> = {
  value: T
  pipes?: ObservablePipeOperator<T, T>[]
  needObserver?: boolean
  key?: Key
  deep?: boolean
}

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

  const input$ = createObservable<T>(resolveObservableState(value) ?? value)
  input$.pipe.apply(null, [pipeDiffState(input$), ...pipes] as any)

  const originContext = getCurrentInstance()
  if (needObserver && originContext) {
    deep
      ? (originContext.context[key!] = input$)
      : originContext.observable.push(input$)
  }

  const state = () => {
    const activeContext = getCurrentInstance()
    if (originContext && activeContext && needObserver && !deep) {
      originContext.deps.add(activeContext.VNode.update!)
    }

    return input$.value
  }
  def(state, "input$", input$)

  const setState = async (nValue: T) => {
    effectState.set(input$, input$.value)
    return input$.next(nValue)
  }

  return [state, setState] as [HookState<T>, HookSetState<T>]
}

function pipeDiffState(input$: Observable) {
  return function (value: any) {
    const oldValue = effectState.get(input$)
    return Object.is(value, oldValue) ? OB_FLAG.SKIP : value
  }
}
