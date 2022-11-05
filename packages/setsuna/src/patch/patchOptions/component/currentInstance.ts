import { ComponentNode } from "./mountComponent"

let activeComponentContext: ComponentNode[] = []
export const getCurrentInstance = () => activeComponentContext.slice(-1)[0]
export const setCurrentInstance = (ins: ComponentNode | null) => {
  return ins ? activeComponentContext.push(ins) : activeComponentContext.pop()
}
