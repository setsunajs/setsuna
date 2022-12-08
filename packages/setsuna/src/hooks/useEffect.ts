import {
  Observable,
  SubOperator,
  UnObservableSubscribe
} from "@setsunajs/observable"
import { resolveObservableState } from "@setsunajs/shared"
import { isArray } from "@setsunajs/shared"
import { error } from "../handler/errorHandler"
import { HookState } from "../runtime.type"
import { useMount } from "./lifecycle"

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

  const unSubList: Array<{ unSub: UnObservableSubscribe; ob: Observable }> = []
  observables.forEach((value, index) => {
    const ob = resolveObservableState(value)
    ob
      ? unSubList.push({ unSub: ob.subscribe(subscribe), ob })
      : error(
          "hook",
          `useEffect, observables item expected 'Observable | HookState', but in observables[${index}] got`,
          [ob, observables[index]]
        )
  })

  useMount(() => {
    return () => {
      unSubList.forEach(({ ob, unSub }) => !ob.closed && unSub())
    }
  })
}
