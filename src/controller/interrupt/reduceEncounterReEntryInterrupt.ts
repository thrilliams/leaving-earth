import { encounterReEntry } from "../maneuver/encounterReEntry";
import type { InterruptReducer } from "../../game";

export const reduceEncounterReEntryInterrupt: InterruptReducer<
	"encounter_re_entry"
> = (model, interrupt) =>
	encounterReEntry(model, interrupt.agencyID, interrupt.spacecraftID, [
		...interrupt.componentIDs,
	]);
