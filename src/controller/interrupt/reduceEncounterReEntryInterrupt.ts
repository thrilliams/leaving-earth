import { encounterReEntry } from "@controller/maneuver/encounterReEntry";
import type { InterruptReducer } from "src/game";

export const reduceEncounterReEntryInterrupt: InterruptReducer<
	"encounter_re_entry"
> = (model, interrupt) =>
	encounterReEntry(model, interrupt.agencyID, interrupt.spacecraftID, [
		...interrupt.componentIDs,
	]);
