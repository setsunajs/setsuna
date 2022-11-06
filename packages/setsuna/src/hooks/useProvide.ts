import { ObservablePipeOperator } from "@setsunajs/observable"
import { error } from "../handler/errorHandler"
import { getCurrentInstance } from "../patch/patchOptions/component/currentInstance"
import { ComponentContextKey } from "../patch/patchOptions/component/mountComponent"
import { createState } from "./createState"

export function useProvide<T>(
  key: ComponentContextKey,
  value: T,
  pipes: ObservablePipeOperator<T, T>[] = []
) {
  const activeMountContext = getCurrentInstance()
  if (!activeMountContext) {
    throw error(
      "hook",
      "useProvide can only be called at the top level when the component is initialized internally"
    )
  }

  return createState({ value, pipes, deep: true, key })
}
