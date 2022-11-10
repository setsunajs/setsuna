import { identityComponent } from "@setsunajs/shared"
import { FC } from "../runtime.type"

export const Teleport = identityComponent(
  "<Teleport/> is an internal component and cannot be used directly"
) as FC<{ to: string | HTMLElement | SVGAElement }>
