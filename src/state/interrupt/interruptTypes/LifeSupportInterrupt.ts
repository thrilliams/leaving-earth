import type { AgencyID } from "../../model/Agency";
import type { ComponentID } from "../../model/component/Component";
import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseInterrupt } from "../Interrupt";

export interface LifeSupportInterrupt extends BaseInterrupt {
	type: "life_support";
	agencyID: AgencyID;
	spacecraftID: SpacecraftID;
	remainingComponents: ComponentID[];
	functionalComponents: ComponentID[];
}
