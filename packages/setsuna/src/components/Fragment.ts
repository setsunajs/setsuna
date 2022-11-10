import { identityComponent } from "@setsunajs/shared"
import { FC } from "../runtime.type"

export const Fragment = identityComponent(
  "<Fragment/> is an internal component and cannot be used directly"
) as FC<{}>
