import { giveAdvancement } from "../helpers/advancement";
import { destroyComponent } from "../helpers/component";
import {
	doesAgencyHaveAdvancement,
	getAdvancement,
} from "../../state/helpers/advancement";
import type { DecisionReducer } from "../../game";

export const reduceTurnInAlienSampleDecision: DecisionReducer<
	"turn_in_alien_sample"
> = (model, decision, choice) => {
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
	} else {
		giveAdvancement(model, decision.agencyID, choice.advancementID);
	}

	return [];
};
