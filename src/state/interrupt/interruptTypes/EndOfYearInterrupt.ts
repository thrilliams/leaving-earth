import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseInterrupt } from "../Interrupt";

// nominally only LifeSupport and MultiYearManeuvers are used as interrupts
export type EndOfYearStep =
	| "repair_and_heal"
	| "life_support"
	| "increment_year"
	| "multi_year_maneuvers"
	| "end_of_year_hazards";

export interface EndOfYearInterrupt extends BaseInterrupt {
	type: "end_of_year";
	step: EndOfYearStep;
	remainingSpacecraftIDs?: SpacecraftID[];
}
