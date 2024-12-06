import { destroyComponent } from "../helpers/component";
import { consumeSupplies } from "../helpers/spacecraft";
import { getComponent, isComponentOfType } from "../../state/helpers/component";
import { getSpacecraft } from "../../state/helpers/spacecraft";
import type { DecisionReducer } from "../../game";

export const reduceLifeSupportDecision: DecisionReducer<"life_support"> = (
	model,
	decision,
	choice,
	logger
) => {
	const spacecraft = getSpacecraft(model, decision.spacecraftID);
	for (const componentID of spacecraft.componentIDs) {
		const component = getComponent(model, componentID);
		if (!isComponentOfType(model, component, "astronaut")) continue;
		if (!choice.astronautIDs.includes(componentID))
			destroyComponent(model, logger, componentID);
	}

	const supplyCount = Math.ceil(choice.astronautIDs.length / 5);

	consumeSupplies(model, logger, decision.spacecraftID, supplyCount);

	logger("before")`${["agency", decision.agencyID]} spent ${[
		"number",
		supplyCount,
	]} ${[
		"string",
		supplyCount !== 1 ? "supplies" : "supply",
	]} to provide life support for ${["number", choice.astronautIDs.length]} ${[
		"string",
		choice.astronautIDs.length !== 1 ? "astronauts" : "astronaut",
	]} onboard ${["spacecraft", decision.spacecraftID]}`;

	return [];
};
