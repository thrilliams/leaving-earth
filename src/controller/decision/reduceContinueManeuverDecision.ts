import { resolveManeuver } from "@controller/maneuver/resolveManeuver";
import { continueManeuverToManeuverInformation } from "@state/choice/choiceTypes/ContinueManeuverChoice";
import type { DecisionReducer } from "src/game";

export const reduceContinueManeuverDecision: DecisionReducer<
	"continue_maneuver"
> = (model, decision, choice) => {
	// if the player chooses to abort, halt
	if (!choice.proceed) return [];

	// otherwise, resolve the maneuver
	return resolveManeuver(
		model,
		continueManeuverToManeuverInformation(decision, choice)
	);
};
