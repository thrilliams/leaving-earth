import { getComponent, isComponentOfType } from "../../state/helpers/component";
import type { DecisionReducer } from "../../game";

export const reduceAssignAstronautsDecision: DecisionReducer<
	"assign_astronauts"
> = (model, _decision, choice) => {
	for (const assignment of choice.capsuleAssignments) {
		for (const astronautID of assignment.atronautIDs) {
			const astronaut = getComponent(model, astronautID);
			if (!isComponentOfType(model, astronaut, "astronaut"))
				throw new Error("expected component to be astronaut");
			astronaut.capsule = assignment.capsuleID;
		}
	}

	return [];
};
