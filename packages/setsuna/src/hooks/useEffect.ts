import { Observable, SubOperator } from "@setsunajs/observable"
import { resolveObservableState } from "@setsunajs/shared"
import { isArray } from "@setsunajs/shared"
import { error } from "../handler/errorHandler"
import { HookState } from "../runtime.type"

export function useEffect<T>(
  observables: Array<Observable<T> | HookState<T>>,
  subscribe: SubOperator<T, T>
) {
  if (!isArray(observables)) {
    return error(
      "hook",
      "useEffect, first param observable must be an array of Array<Observable | HookState>, but got",
      [observables]
    )
  }

  observables.forEach((value, index) => {
    const ob = resolveObservableState(value)
    ob
      ? ob.subscribe(subscribe)
      : error(
          "hook",
          `useEffect, observables item expected 'Observable | HookState', but in observables[${index}] got`,
          [ob, observables[index]]
        )
  })
}
