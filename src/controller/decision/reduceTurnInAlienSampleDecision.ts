import { giveAdvancement } from "../helpers/advancement";
import { destroyComponent } from "../helpers/component";
import {
	doesAgencyHaveAdvancement,
	getAdvancement,
} from "../../state/helpers/advancement";
import type { DecisionReducer } from "../../game";

export const reduceTurnInAlienSampleDecision: DecisionReducer<
	"turn_in_alien_sample"
> = (model, decision, choice, logger) => {
	if (!choice.turnIn) return [];

	destroyComponent(model, decision.sampleID);

	if (
		doesAgencyHaveAdvancement(
			model,
			decision.agencyID,
			choice.advancementID
		)
	) {
		const advancement = getAdvancement(
			model,
			decision.agencyID,
			choice.advancementID
		);
		advancement.outcomes = [];

		logger("before")`${["agency", decision.agencyID]} turned in ${[
			"component",
			decision.sampleID,
		]} to remove all outcomes from ${[
			"advancement",
			choice.advancementID,
		]}`;
	} else {
		giveAdvancement(model, decision.agencyID, choice.advancementID);

		logger("before")`${["agency", decision.agencyID]} turned in ${[
			"component",
			decision.sampleID,
		]} to receive a copy of ${[
			"advancement",
			choice.advancementID,
		]} without any outcomes`;
	}

	return [];
};
