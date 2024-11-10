import type { AgencyID } from "@state/model/Agency";
import type { AssignAstronautsDecision } from "./decisionTypes/AssignAstronautsDecision";
import type { ContinueManeuverDecision } from "./decisionTypes/ContinueManeuverDecision";
import type { CooperateDecision } from "./decisionTypes/CooperateDecision";
import type { DamageComponentDecision } from "./decisionTypes/DamageComponentDecision";
import type { DiscardOutcomeDecision } from "./decisionTypes/DiscardOutcomeDecision";
import type { EncounterLandingDecision } from "./decisionTypes/EncounterLandingDecision";
import type { LifeSupportDecision } from "./decisionTypes/LifeSupportDecision";
import type { RevealLocationDecision } from "./decisionTypes/RevealLocationDecision";
import type { TakeActionDecision } from "./decisionTypes/TakeActionDecision";
import type { TurnInAlienSampleDecision } from "./decisionTypes/TurnInAlienSampleDecision";
import type { TurnInValuableSampleDecision } from "./decisionTypes/TurnInValuableSampleDecision";
import { z } from "zod";

export const DecisionType = z.enum([
	"none",
	"take_action",
	"discard_outcome",
	"continue_maneuver",
	// when encountering i.e. suborbital flight hazard
	"reveal_location",
	"encounter_landing",
	// when failing i.e. rendezvous or landing
	"damage_component",
	// before i.e. radiation or reentry
	"assign_astronauts",
	// for receiving agency of cooperation action
	"cooperate",
	// after life support outcomes drawn
	"life_support",
	// during start-of-year checks
	"turn_in_valuable_sample",
	"turn_in_alien_sample",
]);

export type DecisionType = z.infer<typeof DecisionType>;

export interface BaseDecision {
	type: DecisionType;
	agencyID: AgencyID;
}

// i.e. empty state or end of game
export interface NoneDecision extends BaseDecision {
	type: "none";
}

export type Decision =
	| NoneDecision
	| TakeActionDecision
	| DiscardOutcomeDecision
	| ContinueManeuverDecision
	| RevealLocationDecision
	| EncounterLandingDecision
	| DamageComponentDecision
	| AssignAstronautsDecision
	| CooperateDecision
	| LifeSupportDecision
	| TurnInValuableSampleDecision
	| TurnInAlienSampleDecision;
