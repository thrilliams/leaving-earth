import type { InterruptReducer } from "../../game";
import { encounterReEntry } from "../maneuver/hazards/encounterReEntry";

export const reduceEncounterReEntryInterrupt: InterruptReducer<
	"encounter_re_entry"
> = (model, interrupt, logger) =>
	encounterReEntry(
		model,
		logger,
		interrupt.agencyID,
		interrupt.spacecraftID,
		[...interrupt.componentIDs]
	);
