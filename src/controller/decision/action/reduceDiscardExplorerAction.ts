import { getSpacecraft } from "../../../helpers";
import { completeMission } from "../../helpers/mission";
import type { TakeActionReducer } from "../reduceTakeActionDecision";

export const reduceDiscardExplorerAction: TakeActionReducer<
	"discard_explorer"
> = (model, decision, choice, logger) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);

	logger("after")`${["agency", decision.agencyID]} discard ${[
		"spacecraft",
		choice.spacecraftID,
	]}`;

	for (const mission of model.missions) {
		if (mission.type !== "discard_explorer") continue;
		if (mission.locationID !== spacecraft.locationID) continue;
		completeMission(model, logger, decision.agencyID, mission.id);
	}

	return [];
};
