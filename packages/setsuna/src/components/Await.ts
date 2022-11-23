import { identityComponent } from "@setsunajs/shared"
import { FC, SeElement } from "../runtime.type"

export const Await = identityComponent(
  "<Await/> is an internal component and cannot be used directly"
) as FC<{ active?: boolean | (() => boolean); fallback?: SeElement }>
