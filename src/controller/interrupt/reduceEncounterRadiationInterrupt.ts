import type { InterruptReducer } from "../../game";
import { encounterSolarRadiation } from "../maneuver/hazards/encounterSolarRadiation";

export const reduceEncounterRadiationInterrupt: InterruptReducer<
	"encounter_radiation"
> = (model, interrupt, logger) =>
	encounterSolarRadiation(
		model,
		logger,
		interrupt.agencyID,
		interrupt.spacecraftID,
		interrupt.severity,
		interrupt.years,
		interrupt.astronautsAssigned
	);
