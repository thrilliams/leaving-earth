import { getSpacecraft } from "@state/helpers/spacecraft";
import type { TakeActionReducer } from "@controller/decision/reduceTakeActionDecision";
import { getAgency } from "@state/helpers/agency";
import { getNextID } from "@controller/helpers/id";

export const reduceCollectSuppliesAction: TakeActionReducer<
	"collect_supplies"
> = (model, decision, choice) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);

	const agency = getAgency(model, decision.agencyID);
	const componentID = getNextID(model);
	agency.components.push({
		id: componentID,
		type: "supplies",
		damaged: false,
	});

	spacecraft.componentIDs.push(componentID);

	return [];
};
