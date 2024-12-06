import { consumeSupplies } from "../../helpers/spacecraft";
import {
	getComponent,
	isComponentOfType,
} from "../../../state/helpers/component";
import { getSpacecraft } from "../../../state/helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";

export const reduceRepairComponentsAction: TakeActionReducer<
	"repair_components"
> = (model, decision, choice, logger) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);

	for (const componentID of spacecraft.componentIDs) {
		const component = getComponent(model, componentID);
		if (isComponentOfType(model, component, "astronaut")) continue;
		component.damaged = false;
	}

	consumeSupplies(model, logger, choice.spacecraftID);

	// this might want to be "before"
	logger("after")`${[
		"agency",
		decision.agencyID,
	]} spent a supply to repair all components onboard ${[
		"spacecraft",
		choice.spacecraftID,
	]}`;

	return [];
};
