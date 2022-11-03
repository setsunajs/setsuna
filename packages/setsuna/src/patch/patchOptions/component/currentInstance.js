let activeComponentContext = []
export const getCurrentInstance = () => activeComponentContext.at(-1)
export const setCurrentInstance = ins => {
  return ins ? activeComponentContext.push(ins) : activeComponentContext.pop()
}
