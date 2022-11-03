import { resolveObservableState } from "@setsunajs/share"
import { isArray } from "@setsunajs/share"
import { error } from "../handler/errorHandler"

export function useEffect(subObs, subscribe) {
  if (!isArray(subObs)) {
    return error(
      "hook-useEffect",
      "观察者目标必须是一个 Array<Observable> | Array<State> 类型的数组"
    )
  }
  subObs.forEach(value => {
    const ob = resolveObservableState(value)
    ob
      ? ob.subscribe(subscribe)
      : error("hook-useEffect", "订阅目标不是一个合法的 Observable state")
  })
}
