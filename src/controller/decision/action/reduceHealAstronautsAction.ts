import {
	getComponent,
	isComponentOfType,
} from "../../../state/helpers/component";
import { getSpacecraft } from "../../../state/helpers/spacecraft";
import { checkForScientistSampleCompletion } from "../../helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";

export const reduceHealAstronautsAction: TakeActionReducer<
	"heal_astronauts"
> = (model, decision, choice, logger) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);

	for (const astronautID of spacecraft.componentIDs) {
		const astronaut = getComponent(model, astronautID);
		if (!isComponentOfType(model, astronaut, "astronaut")) continue;
		astronaut.damaged = false;
	}

	// this might want to be "before"
	logger("after")`${[
		"agency",
		decision.agencyID,
	]} healed all astronauts onboard ${["spacecraft", choice.spacecraftID]}`;

	checkForScientistSampleCompletion(model, logger, choice.spacecraftID);

	return [];
};
