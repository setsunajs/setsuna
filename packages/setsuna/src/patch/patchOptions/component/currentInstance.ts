import { ComponentNode } from "../../../runtime.type"

let activeComponentContext: ComponentNode[] = []
export const getCurrentInstance = () => activeComponentContext.at(-1)
export const setCurrentInstance = (ins?: ComponentNode) => {
  return ins ? activeComponentContext.push(ins) : activeComponentContext.pop()
}
