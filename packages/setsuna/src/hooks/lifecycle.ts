import { error } from "../handler/errorHandler"
import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"

export function useUpdate(fn: () => void | (() => any)) {
  const activeMountContext = getCurrentInstance()
  return activeMountContext
    ? activeMountContext.updates.push(fn)
    : error("hook", "useUpdate can only be called during component mounting")
}

export function useMount(fn: () => void | (() => any)) {
  const activeMountContext = getCurrentInstance()
  return activeMountContext
    ? activeMountContext.mounts.push(fn)
    : error("hook", "useMount, can only be called during component mounting")
}
