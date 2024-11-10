import { shuffleArray } from "@controller/helpers/rng/array";
import { getAdvancement } from "@state/helpers/advancement";
import { getAgency } from "@state/helpers/agency";
import type { DecisionReducer } from "src/game";

export const reduceDiscardOutcomeDecision: DecisionReducer<
	"discard_outcome"
> = (model, decision, choice) => {
	const agency = getAgency(model, decision.agencyID);
	const outcome = decision.outcome;

	if (choice.discard) {
		// if discarding,
		const requiredFunds = outcome === "success" ? 10 : 5;
		// subtract funds
		agency.funds -= requiredFunds;
	} else {
		// otherwise, put the outcome back
		const advancement = getAdvancement(
			model,
			decision.agencyID,
			decision.advancementID
		);

		advancement.outcomes.push(outcome);

		// and shuffle
		advancement.outcomes = shuffleArray(model, advancement.outcomes);
	}

	return [];
};
