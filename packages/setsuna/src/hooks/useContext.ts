import { isPlainObject } from "@setsunajs/shared"
import { ObservablePipeOperator } from "@setsunajs/observable"
import { error } from "../handler/errorHandler"
import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"
import { ComponentContextKey } from "../patch/patchOptions/patchNodeTypes"
import { createState, HookState } from "./createState"
import { useMount } from "./lifecycle"

export function useContext<T = any>(
  key: ComponentContextKey,
  pipes: ObservablePipeOperator<T, T>[]
): HookState<T>
export function useContext<T = any>(
  key: ComponentContextKey,
  options: {
    defaultValue?: T
    pipes: ObservablePipeOperator<T, T>[]
  }
): HookState<T>
export function useContext(key: ComponentContextKey, options: any) {
  let defaultValue
  let pipes = []
  if (
    isPlainObject(options) &&
    ("pipe" in options || "defaultValue" in options)
  ) {
    defaultValue = options.defaultValue
    pipes = options.defaultValue
  } else {
    pipes = options
  }

  const activeContext = getCurrentInstance()
  if (!activeContext) {
    throw error(
      "hook",
      "useContext can only be called at the top level when the component is initialized internally"
    )
  }

  const ctxValue = activeContext.context[key]
  const [state, setState] = createState({
    value: (ctxValue ?? defaultValue) as any,
    pipes
  })

  if (ctxValue) {
    const unSubscribe = ctxValue.subscribe(value => setState(value))
    useMount(() => () => unSubscribe())
  }

  return state
}
