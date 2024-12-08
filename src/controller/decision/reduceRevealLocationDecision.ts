import { destroyComponent } from "../helpers/component";
import { revealLocation } from "../helpers/location";
import { getComponent, isComponentOfType } from "../../state/helpers/component";
import { getLocation } from "../../state/helpers/location";
import { getSpacecraft } from "../../state/helpers/spacecraft";
import type { DecisionReducer } from "../../game";

export const reduceRevealLocationDecision: DecisionReducer<
	"reveal_location"
> = (model, decision, choice, logger) => {
	const location = getLocation(model, decision.locationID);
	if (!location.explorable) throw new Error("location not explorable");
	if (location.revealed) throw new Error("location already revealed");

	if (choice.reveal) {
		// if the player reveals the location, proceed as normal
		revealLocation(
			model,
			logger,
			decision.locationID,
			decision.agencyID,
			decision.componentID
		);

		if (decision.componentID !== undefined) {
			const component = getComponent(model, decision.componentID);
			if (
				!isComponentOfType(model, component, "probe") &&
				!isComponentOfType(model, component, "capsule")
			)
				throw new Error(
					"expected to be component of type probe or capsule"
				);
			component.surveyedThisTurn = true;
		}

		logger("after")`${[
			"agency",
			decision.agencyID,
		]} revealed the location hazard on ${[
			"location",
			decision.locationID,
		]}`;
	} else if (location.astronautOnly) {
		// otherwise, if i.e. suborbital flight, kill every astronaut
		const spacecraft = getSpacecraft(model, decision.spacecraftID);

		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			if (isComponentOfType(model, component, "astronaut"))
				destroyComponent(model, logger, componentID);
		}

		logger("after")`${[
			"agency",
			decision.agencyID,
		]} did not reveal the location hazard on ${[
			"location",
			decision.locationID,
		]}`;

		logger("before")`all astronauts onboard ${[
			"spacecraft",
			decision.spacecraftID,
		]} were killed`;
	}

	return [];
};
