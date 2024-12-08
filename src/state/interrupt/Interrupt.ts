import type { ContinueManeuverInterrupt } from "./interruptTypes/ContinueManeuverInterrupt";
import type { EncounterLocationInterrupt } from "./interruptTypes/EncounterLocationInterrupt";
import type { EncounterRadiationInterrupt } from "./interruptTypes/EncounterRadiationInterrupt";
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
	| "end_of_turn_maneuvers"
	| "continue_maneuver"
	| "encounter_radiation"
	| "encounter_location";

export interface BaseInterrupt {
	type: InterruptType;
}

export type Interrupt =
	| StartOfYearInterrupt
	| EndOfYearInterrupt
	| LifeSupportInterrupt
	| EncounterReEntryInterrupt
	| EndOfTurnManeuversInterrupt
	| ContinueManeuverInterrupt
	| EncounterRadiationInterrupt
	| EncounterLocationInterrupt;
