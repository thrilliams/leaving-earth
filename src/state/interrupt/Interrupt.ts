import type { EncounterReEntryInterrupt } from "./interruptTypes/EncounterReEntryInterrupt";
import type { EndOfTurnManeuversInterrupt } from "./interruptTypes/EndOfTurnManeuversInterrupt";
import type { EndOfYearInterrupt } from "./interruptTypes/EndOfYearInterrupt";
import type { LifeSupportInterrupt } from "./interruptTypes/LifeSupportInterrupt";
import type { StartOfYearInterrupt } from "./interruptTypes/StartOfYearInterrupt";

export type InterruptType =
	| "start_of_year"
	| "end_of_year"
	| "life_support"
	| "encounter_re_entry"
	| "end_of_turn_maneuvers";

export interface BaseInterrupt {
	type: InterruptType;
}

export type Interrupt =
	| StartOfYearInterrupt
	| EndOfYearInterrupt
	| LifeSupportInterrupt
	| EncounterReEntryInterrupt
	| EndOfTurnManeuversInterrupt;
