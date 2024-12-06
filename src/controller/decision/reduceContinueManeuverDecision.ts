import { resolveManeuver } from "../maneuver/resolveManeuver";
import { continueManeuverToManeuverInformation } from "../../state/choice/choiceTypes/ContinueManeuverChoice";
import type { DecisionReducer } from "../../game";

export const reduceContinueManeuverDecision: DecisionReducer<
	"continue_maneuver"
> = (model, decision, choice, logger) => {
	// if the player chooses to abort, halt
	if (!choice.proceed) {
		logger("before")`${["agency", decision.agencyID]} chose to abort ${[
			"maneuver",
			decision.maneuverID,
		]} with ${["spacecraft", decision.spacecraftID]}`;
		return [];
	}

	// otherwise, resolve the maneuver
	return resolveManeuver(
		model,
		logger,
		continueManeuverToManeuverInformation(decision, choice)
	);
};
