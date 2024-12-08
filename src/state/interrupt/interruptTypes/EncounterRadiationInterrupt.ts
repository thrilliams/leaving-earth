import type { AgencyID } from "../../model/Agency";
import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseInterrupt } from "../Interrupt";

export interface EncounterRadiationInterrupt extends BaseInterrupt {
	type: "encounter_radiation";
	agencyID: AgencyID;
	spacecraftID: SpacecraftID;
	severity: number;
	years: number;
	astronautsAssigned: boolean;
}
