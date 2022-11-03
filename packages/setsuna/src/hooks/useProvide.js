import { isFunction } from "@setsunajs/share"
import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"
import { createState } from "./useState"

let id = 0
export function useProvide(key = `$$context(${id++})`, value) {
  const activeMountContext = getCurrentInstance()
  if (!activeMountContext) {
    throw "useProvide 只能在组件内部初始化时、顶层被调用"
  }

  const { state, input$ } = createState(value, { noObserver: true })
  function setState(newState) {
    input$.next(isFunction(newState) ? newState(state()) : newState)
  }

  activeMountContext.context[key] = { state, input$ }
  return [state, setState, input$]
}
