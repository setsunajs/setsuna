import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"
import { useMount } from "./lifecycle"
import { useState } from "./useState"

export function useContext(key, value) {
  const activeMountContext = getCurrentInstance()
  if (!activeMountContext) {
    throw "useContext 只能在组件内部初始化时、顶层被调用"
  }

  const ctxValue = activeMountContext.context[key]
  const [state, setState] = useState(() =>
    ctxValue ? ctxValue.state() : value
  )

  if (ctxValue) {
    const unSubscribe = ctxValue.input$.subscribe(value => setState(value))
    useMount(() => () => unSubscribe())
  }

  return state
}
