import type { DecisionReducer } from "../../game";
import { continueManeuverToManeuverInformation } from "../../state/choice/choiceTypes/ContinueManeuverChoice";
import { destroyComponent } from "../helpers/component";
import { resolveManeuver } from "../maneuver/resolveManeuver";

export const reduceContinueManeuverDecision: DecisionReducer<
	"continue_maneuver"
> = (model, decision, choice, logger) => {
	// if the player chooses to abort, halt
	if (!choice.proceed) {
		logger("before")`${["agency", decision.agencyID]} chose to abort ${[
			"maneuver",
			decision.maneuverID,
			decision.profileIndex,
		]} with ${["spacecraft", decision.spacecraftID]}`;

		for (const rocketID of decision.spentRocketIDs)
			destroyComponent(model, logger, rocketID);

		return [];
	}

	// otherwise, resolve the maneuver
	return resolveManeuver(
		model,
		logger,
		continueManeuverToManeuverInformation(decision, choice)
	);
};
