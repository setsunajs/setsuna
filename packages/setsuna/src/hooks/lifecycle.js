import { error } from "../handler/errorHandler"
import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"

export function useUpdate(fn) {
  const activeMountContext = getCurrentInstance()
  return activeMountContext
    ? activeMountContext.updates.push(fn)
    : error("hook-useUpdate", "useUpdate 只能在组件挂载期间才可以调用")
}

export function useMount(fn) {
  const activeMountContext = getCurrentInstance()
  return activeMountContext
    ? activeMountContext.mounts.push(fn)
    : error("hook-useMount", "useMount 只能在组件挂载期间才可以调用")
}
