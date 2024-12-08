import type { InterruptReducer } from "../../game";
import { encounterLocation } from "../maneuver/hazards/encounterLocation";

export const reduceEncounterLocationInterrupt: InterruptReducer<
	"encounter_location"
> = (model, interrupt, logger) =>
	encounterLocation(
		model,
		logger,
		interrupt.agencyID,
		interrupt.spacecraftID,
		interrupt.locationID,
		interrupt.years,
		interrupt.effectIndex
	);
