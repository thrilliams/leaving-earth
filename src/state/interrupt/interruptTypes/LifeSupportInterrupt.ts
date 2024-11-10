import type { AgencyID } from "@state/model/Agency";
import type { ComponentID } from "@state/model/component/Component";
import type { SpacecraftID } from "@state/model/Spacecraft";
import type { BaseInterrupt } from "../Interrupt";

export interface LifeSupportInterrupt extends BaseInterrupt {
	type: "life_support";
	agencyID: AgencyID;
	spacecraftID: SpacecraftID;
	remainingComponents: ComponentID[];
	functionalComponents: ComponentID[];
}
