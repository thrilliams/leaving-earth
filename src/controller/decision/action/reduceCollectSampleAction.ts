import { getSpacecraft } from "../../../state/helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";
import { getSampleDefinitionOfLocation } from "../../../state/helpers/component/definition";
import { getAgency } from "../../../state/helpers/agency";
import { getNextID } from "../../helpers/id";

export const reduceCollectSampleAction: TakeActionReducer<"collect_sample"> = (
	model,
	decision,
	choice
) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);
	const sampleDefinition = getSampleDefinitionOfLocation(
		model,
		spacecraft.locationID
	);

	const agency = getAgency(model, decision.agencyID);
	const componentID = getNextID(model);
	agency.components.push({
		id: componentID,
		type: sampleDefinition.id,
		damaged: false,
	});

	spacecraft.componentIDs.push(componentID);

	return [];
};
