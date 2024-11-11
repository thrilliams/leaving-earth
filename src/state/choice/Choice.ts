import { DecisionType } from "../decision/Decision";
import { z } from "zod";
import type { AssignAstronautsChoice } from "./choiceTypes/AssignAstronautsChoice";
import type { ContinueManeuverChoice } from "./choiceTypes/ContinueManeuverChoice";
import type { CooperateChoice } from "./choiceTypes/CooperateChoice";
import type { DamageComponentChoice } from "./choiceTypes/DamageComponentChoice";
import type { DiscardOutcomeChoice } from "./choiceTypes/DiscardOutcomeChoice";
import type { EncounterLandingChoice } from "./choiceTypes/EncounterLandingChoice";
import type { LifeSupportChoice } from "./choiceTypes/LifeSupportChoice";
import type { RevealLocationChoice } from "./choiceTypes/RevealLocationChoice";
import type { TakeActionChoice } from "./choiceTypes/TakeActionChoice";
import type { TurnInAlienSampleChoice } from "./choiceTypes/TurnInAlienSampleChoice";
import type { TurnInValuableSampleChoice } from "./choiceTypes/TurnInValuableSampleChoice";

export const BaseChoice = z.strictObject({
	type: DecisionType,
});

export type Choice =
	| TakeActionChoice
	| DiscardOutcomeChoice
	| ContinueManeuverChoice
	| RevealLocationChoice
	| EncounterLandingChoice
	| DamageComponentChoice
	| AssignAstronautsChoice
	| CooperateChoice
	| LifeSupportChoice
	| TurnInValuableSampleChoice
	| TurnInAlienSampleChoice;
