import {
	type DecisionReducer as BaseDecisionReducer,
	type InterruptReducer as BaseInterruptReducer,
	type GameType,
	createGame,
} from "laika-engine";
import { reduceAssignAstronautsDecision } from "./controller/decision/reduceAssignAstronautsDecision";
import { reduceContinueManeuverDecision } from "./controller/decision/reduceContinueManeuverDecision";
import { reduceCooperateDecision } from "./controller/decision/reduceCooperateDecision";
import { reduceDamageComponentDecision } from "./controller/decision/reduceDamageComponentDecision";
import { reduceDiscardOutcomeDecision } from "./controller/decision/reduceDiscardOutcomeDecision";
import { reduceEncounterLandingDecision } from "./controller/decision/reduceEncounterLandingDecision";
import { reduceLifeSupportDecision } from "./controller/decision/reduceLifeSupportDecision";
import { reduceRevealLocationDecision } from "./controller/decision/reduceRevealLocationDecision";
import { reduceTakeActionDecision } from "./controller/decision/reduceTakeActionDecision";
import { reduceTurnInAlienSampleDecision } from "./controller/decision/reduceTurnInAlienSampleDecision";
import { reduceTurnInValuableSampleDecision } from "./controller/decision/reduceTurnInValuableSampleDecision";
import { reduceEncounterReEntryInterrupt } from "./controller/interrupt/reduceEncounterReEntryInterrupt";
import { reduceEndOfYearInterrupt } from "./controller/interrupt/reduceEndOfYearInterrupt";
import { reduceLifeSupportInterrupt } from "./controller/interrupt/reduceLifeSupportInterrupt";
import { reduceStartOfYearInterrupt } from "./controller/interrupt/reduceStartOfYearInterrupt";
import {
	type InitializationOptions,
	createInitialPayload,
} from "./controller/setup/createInitialPayload";
import type { Choice } from "./state/choice/Choice";
import { validateAssignAstronauts } from "./state/choice/choiceTypes/AssignAstronautsChoice";
import { validateContinueManeuver } from "./state/choice/choiceTypes/ContinueManeuverChoice";
import { validateCooperate } from "./state/choice/choiceTypes/CooperateChoice";
import { validateDamageComponent } from "./state/choice/choiceTypes/DamageComponentChoice";
import { validateDiscardOutcome } from "./state/choice/choiceTypes/DiscardOutcomeChoice";
import { validateEncounterLanding } from "./state/choice/choiceTypes/EncounterLandingChoice";
import { validateLifeSupport } from "./state/choice/choiceTypes/LifeSupportChoice";
import { validateRevealLocation } from "./state/choice/choiceTypes/RevealLocationChoice";
import { validateTakeAction } from "./state/choice/choiceTypes/TakeActionChoice";
import { validateTurnInAlienSample } from "./state/choice/choiceTypes/TurnInAlienSampleChoice";
import { validateTurnInValuableSample } from "./state/choice/choiceTypes/TurnInValuableSampleChoice";
import type { Decision } from "./state/decision/Decision";
import type { Interrupt } from "./state/interrupt/Interrupt";
import type { LogObjectContext } from "./state/logging/LogObjectContext";
import type { Model } from "./state/model/Model";
import { reduceEndOfTurnManeuversInterrupt } from "./controller/interrupt/reduceEndOfTurnManeuversInterrupt";

export type Game = GameType<
	Model,
	Decision,
	Choice,
	Interrupt,
	LogObjectContext
>;

export type DecisionReducer<T extends Decision["type"]> = BaseDecisionReducer<
	Game,
	T
>;

export type InterruptReducer<T extends Interrupt["type"]> =
	BaseInterruptReducer<Game, T>;

export const {
	getStateByID,
	createInitialGameState,
	validateChoice,
	reduceChoice,
} = createGame<Game, InitializationOptions>({
	createInitialPayload,
	choiceValidators: {
		take_action: validateTakeAction,
		discard_outcome: validateDiscardOutcome,
		continue_maneuver: validateContinueManeuver,
		reveal_location: validateRevealLocation,
		encounter_landing: validateEncounterLanding,
		damage_component: validateDamageComponent,
		assign_astronauts: validateAssignAstronauts,
		cooperate: validateCooperate,
		life_support: validateLifeSupport,
		turn_in_valuable_sample: validateTurnInValuableSample,
		turn_in_alien_sample: validateTurnInAlienSample,
	},
	decisionReducers: {
		none: () => [],
		take_action: reduceTakeActionDecision,
		discard_outcome: reduceDiscardOutcomeDecision,
		continue_maneuver: reduceContinueManeuverDecision,
		reveal_location: reduceRevealLocationDecision,
		encounter_landing: reduceEncounterLandingDecision,
		damage_component: reduceDamageComponentDecision,
		assign_astronauts: reduceAssignAstronautsDecision,
		cooperate: reduceCooperateDecision,
		life_support: reduceLifeSupportDecision,
		turn_in_valuable_sample: reduceTurnInValuableSampleDecision,
		turn_in_alien_sample: reduceTurnInAlienSampleDecision,
	},
	interruptReducers: {
		start_of_year: reduceStartOfYearInterrupt,
		end_of_year: reduceEndOfYearInterrupt,
		life_support: reduceLifeSupportInterrupt,
		encounter_re_entry: reduceEncounterReEntryInterrupt,
		end_of_turn_maneuvers: reduceEndOfTurnManeuversInterrupt,
	},
});
