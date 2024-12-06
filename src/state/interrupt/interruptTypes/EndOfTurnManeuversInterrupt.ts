import type { AgencyID } from "../../model/Agency";
import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseInterrupt } from "../Interrupt";

export interface EndOfTurnManeuversInterrupt extends BaseInterrupt {
	type: "end_of_turn_maneuvers";
	agencyID: AgencyID;
	remainingSpacecraftIDs: SpacecraftID[];
}
