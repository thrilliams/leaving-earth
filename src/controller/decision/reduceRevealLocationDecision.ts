import { destroyComponent } from "../helpers/component";
import { revealLocation } from "../helpers/location";
import { getComponent, isComponentOfType } from "../../state/helpers/component";
import { getLocation } from "../../state/helpers/location";
import { getSpacecraft } from "../../state/helpers/spacecraft";
import type { DecisionReducer } from "../../game";

export const reduceRevealLocationDecision: DecisionReducer<
	"reveal_location"
> = (model, decision, choice) => {
	const location = getLocation(model, decision.locationID);
	if (!location.explorable) throw new Error("location not explorable");
	if (location.revealed) throw new Error("location already revealed");

	if (choice.reveal) {
		// if the player reveals the location, proceed as normal
		revealLocation(model, decision.locationID, decision.agencyID);
	} else if (location.astronautOnly) {
		// otherwise, if i.e. suborbital flight, kill every astronaut
		const spacecraft = getSpacecraft(model, decision.spacecraftID);

		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			if (isComponentOfType(model, component, "astronaut"))
				destroyComponent(model, componentID);
		}
	}

	return [];
};
