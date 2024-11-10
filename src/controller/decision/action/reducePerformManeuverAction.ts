import { resolveManeuver } from "@controller/maneuver/resolveManeuver";
import {
	performManeuverActionToManeuverInformation,
	type PerformManeuverActionChoice,
} from "@state/choice/choiceTypes/actionTypes/PerformManeuverActionChoice";
import type { TakeActionDecision } from "@state/decision/decisionTypes/TakeActionDecision";
import type { TakeActionReducer } from "@controller/decision/reduceTakeActionDecision";

export const reducePerformManeuverAction: TakeActionReducer<
	"perform_maneuver"
> = (model, decision, choice) =>
	resolveManeuver(
		model,
		performManeuverActionToManeuverInformation(
			decision as TakeActionDecision,
			choice as PerformManeuverActionChoice
		)
	);
