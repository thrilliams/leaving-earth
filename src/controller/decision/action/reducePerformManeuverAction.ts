import { resolveManeuver } from "../../maneuver/resolveManeuver";
import {
	performManeuverActionToManeuverInformation,
	type PerformManeuverActionChoice,
} from "../../../state/choice/choiceTypes/actionTypes/PerformManeuverActionChoice";
import type { TakeActionDecision } from "../../../state/decision/decisionTypes/TakeActionDecision";
import type { TakeActionReducer } from "../reduceTakeActionDecision";

export const reducePerformManeuverAction: TakeActionReducer<
	"perform_maneuver"
> = (model, decision, choice, logger) => {
	logger("before")`${["agency", decision.agencyID]} began ${[
		"maneuver",
		choice.maneuverID,
	]} with ${["spacecraft", choice.spacecraftID]}`;

	return resolveManeuver(
		model,
		logger,
		performManeuverActionToManeuverInformation(
			decision as TakeActionDecision,
			choice as PerformManeuverActionChoice
		)
	);
};
