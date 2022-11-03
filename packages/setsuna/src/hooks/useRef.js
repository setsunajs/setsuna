import { resolveObservableState } from "@setsunajs/share"
import { isFunction } from "@setsunajs/share"
import { createState } from "./useState"

export function useRef(value) {
  const _input$ = resolveObservableState(value)
  const { state, input$ } = createState(_input$ ? _input$ : value, {
    noObserver: true
  })
  const setState = newState => {
    input$.next(isFunction(newState) ? newState(state()) : newState)
  }
  return [state, setState, input$]
}
