import { getComponent, isComponentOfType } from "../../../state/helpers/component";
import { getSpacecraft } from "../../../state/helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";

export const reduceHealAstronautsAction: TakeActionReducer<
	"heal_astronauts"
> = (model, _decision, choice) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);

	for (const astronautID of spacecraft.componentIDs) {
		const astronaut = getComponent(model, astronautID);
		if (!isComponentOfType(model, astronaut, "astronaut")) continue;
		astronaut.damaged = false;
	}

	return [];
};
