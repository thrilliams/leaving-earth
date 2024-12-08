import type { LocationID } from "../../../model";
import type { AgencyID } from "../../model/Agency";
import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseInterrupt } from "../Interrupt";

export interface EncounterLocationInterrupt extends BaseInterrupt {
	type: "encounter_location";
	agencyID: AgencyID;
	spacecraftID: SpacecraftID;
	locationID: LocationID;
	years: number;
	effectIndex: number;
}
