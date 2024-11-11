import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseDecision } from "../Decision";

export interface EncounterLandingDecision extends BaseDecision {
	type: "encounter_landing";
	spacecraftID: SpacecraftID;
}
