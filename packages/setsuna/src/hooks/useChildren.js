import { error } from "../handler/errorHandler"
import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"

export function useChildren() {
  const activeContext = getCurrentInstance()
  return activeContext
    ? [...activeContext.slot]
    : error("hook-useChildren", "useChildren 只能在组件挂载期间才可以调用")
}
