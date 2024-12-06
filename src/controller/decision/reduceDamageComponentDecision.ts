import { getComponent } from "../../state/helpers/component";
import type { DecisionReducer } from "../../game";

export const reduceDamageComponentDecision: DecisionReducer<
	"damage_component"
> = (model, decision, choice, logger) => {
	if (choice.componentID !== undefined) {
		const component = getComponent(model, choice.componentID);
		component.damaged = true;

		logger(`after`)`${["agency", decision.agencyID]} chose to damage ${[
			"component",
			choice.componentID,
		]}`;
	}

	return [];
};
