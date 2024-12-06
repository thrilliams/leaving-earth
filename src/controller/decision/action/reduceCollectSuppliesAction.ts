import { getSpacecraft } from "../../../state/helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";
import { getAgency } from "../../../state/helpers/agency";
import { getNextID } from "../../helpers/id";

export const reduceCollectSuppliesAction: TakeActionReducer<
	"collect_supplies"
> = (model, decision, choice, logger) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);

	const agency = getAgency(model, decision.agencyID);
	const componentID = getNextID(model);
	agency.components.push({
		id: componentID,
		type: "supplies",
		damaged: false,
	});

	spacecraft.componentIDs.push(componentID);

	logger("after")`${["agency", decision.agencyID]} collected supplies from ${[
		"location",
		spacecraft.locationID,
	]} with ${["spacecraft", choice.spacecraftID]}`;

	return [];
};
