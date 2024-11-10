import { getComponent } from "@state/helpers/component";
import type { DecisionReducer } from "src/game";

export const reduceDamageComponentDecision: DecisionReducer<
	"damage_component"
> = (model, _decision, choice) => {
	if (choice.componentID !== undefined) {
		const component = getComponent(model, choice.componentID);
		component.damaged = true;
	}

	return [];
};
