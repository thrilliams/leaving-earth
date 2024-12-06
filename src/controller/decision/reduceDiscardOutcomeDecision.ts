import { shuffleArray } from "../helpers/rng/array";
import { getAdvancement } from "../../state/helpers/advancement";
import { getAgency } from "../../state/helpers/agency";
import type { DecisionReducer } from "../../game";

export const reduceDiscardOutcomeDecision: DecisionReducer<
	"discard_outcome"
> = (model, decision, choice, logger) => {
	const agency = getAgency(model, decision.agencyID);

	if (choice.discard) {
		// if discarding,
		const requiredFunds = decision.outcome === "success" ? 10 : 5;
		// subtract funds
		agency.funds -= requiredFunds;

		logger("after")`${["agency", decision.agencyID]} spent $${[
			"number",
			requiredFunds,
		]} to discard ${["outcome", decision.outcome]} from ${[
			"advancement",
			decision.advancementID,
		]}`;
	} else {
		// otherwise, put the outcome back
		const advancement = getAdvancement(
			model,
			decision.agencyID,
			decision.advancementID
		);

		advancement.outcomes.push(decision.outcome);

		// and shuffle
		advancement.outcomes = shuffleArray(model, advancement.outcomes);

		logger("after")`${["agency", decision.agencyID]} returned ${[
			"outcome",
			decision.outcome,
		]} to ${["advancement", decision.advancementID]}`;
	}

	return [];
};
