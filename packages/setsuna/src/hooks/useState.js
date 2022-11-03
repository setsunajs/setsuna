import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"
import { isObservable, Observable, RETURN } from "@setsunajs/observable"
import {
  isArray,
  isFunction,
  resolveObservableState,
  def
} from "@setsunajs/share"
import { error } from "../handler/errorHandler"

export function createState(value, options) {
  let oldValue = void 0
  const { noObserver, noParam } = options ?? {}
  const input$ = new Observable(
    !noParam && isObservable(value) ? value : undefined
  )

  input$
    .pipe(newValue => (Object.is(newValue, value) ? RETURN.SKIP : newValue))
    .subscribe(v => {
      oldValue = value
      value = v
    })

  const originContext = getCurrentInstance()
  if (!noObserver && originContext) {
    originContext.observable.push(input$)
  }

  function state() {
    const activeRenderContext = getCurrentInstance()
    if (
      !noObserver &&
      originContext &&
      activeRenderContext &&
      activeRenderContext !== originContext
    ) {
      originContext.deps.add(activeRenderContext.VNode.update)
    }
    return value
  }
  def(state, "input$", { get: () => input$ })
  def(state, "state", { get: () => oldValue })
  return { state, input$ }
}

export function useState(value, pipes) {
  if (isFunction(value)) {
    value = value()
  }

  const _input$ = resolveObservableState(value)
  const { state, input$ } = createState(_input$ ? _input$ : value)
  const setState = newState => {
    input$.next(isFunction(newState) ? newState(state()) : newState)
  }
  if (pipes) {
    if (isArray(pipes)) {
      input$.pipe(...pipes)
    } else {
      error("hook-useState", "不是合法的管道操作符", [])
    }
  }
  return [state, setState, input$]
}
