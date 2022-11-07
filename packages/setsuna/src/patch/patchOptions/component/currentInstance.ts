import { ComponentNode } from "../patchNodeTypes"

let activeComponentContext: ComponentNode[] = []
export const getCurrentInstance = () => activeComponentContext.at(-1)
export const setCurrentInstance = (ins: ComponentNode | null) => {
  return ins ? activeComponentContext.push(ins) : activeComponentContext.pop()
}
