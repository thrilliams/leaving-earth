import { destroyComponent } from "../helpers/component";
import { consumeSupplies } from "../helpers/spacecraft";
import { getComponent, isComponentOfType } from "../../state/helpers/component";
import { getSpacecraft } from "../../state/helpers/spacecraft";
import type { DecisionReducer } from "../../game";

export const reduceLifeSupportDecision: DecisionReducer<"life_support"> = (
	model,
	decision,
	choice
) => {
	const spacecraft = getSpacecraft(model, decision.spacecraftID);
	for (const componentID of spacecraft.componentIDs) {
		const component = getComponent(model, componentID);
		if (!isComponentOfType(model, component, "astronaut")) continue;
		if (!choice.astronautIDs.includes(componentID))
			destroyComponent(model, componentID);
	}

	consumeSupplies(
		model,
		decision.spacecraftID,
		choice.astronautIDs.length / 5
	);

	return [];
};
