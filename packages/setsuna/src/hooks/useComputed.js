import { isFunction, isPlainObject, noop } from "@setsunajs/share"
import { error } from "../handler/errorHandler"
import { useEffect } from "./useEffect"
import { createState } from "./useState"

export function useComputed(subObs, options) {
  let getter = () => {
    return error("hook-useComputed", "getter 获取器未定义，获取失败")
  }
  let setter = () => {
    return error("hook-useComputed", "setter 修改器未定义，禁止修改")
  }

  if (isPlainObject(options)) {
    isFunction(options.get) && (getter = options.get)
    isFunction(options.set) && (getter = options.set)
  } else if (isFunction(options)) {
    getter = options
  }

  const { state, input$ } = createState(getter(), { noParam: true })
  const setState = newState => {
    if (!setter) {
      return error("hook-useComputed", "setter 修改器未定义，禁止修改")
    }
    isFunction(newState) ? setter(newState(state())) : setter(newState)
  }

  useEffect(subObs, () => input$.next(getter()))

  return [state, setState, input$]
}
