import { encounterReEntry } from "../maneuver/encounterReEntry";
import type { InterruptReducer } from "../../game";

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
