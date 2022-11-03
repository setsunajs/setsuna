import { unmountFragment } from "../fragment/unmountFragment"

export function unmountAwait(node) {
  Object.assign(node._e, {
    container: null,
    id: -99
  })
  unmountFragment(node)
}
