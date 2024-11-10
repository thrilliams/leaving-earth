import { getAgency } from "@state/helpers/agency";
import type { TakeActionReducer } from "@controller/decision/reduceTakeActionDecision";
import { getComponentDefinition } from "@state/helpers/component/definition";
import { getNextID } from "@controller/helpers/id";

export const reduceBuyComponentAction: TakeActionReducer<"buy_component"> = (
	model,
	decision,
	choice
) => {
	const agency = getAgency(model, decision.agencyID);
	const definition = getComponentDefinition(
		model,
		choice.componentDefinitionID
	);

	if ("cost" in definition) agency.funds -= definition.cost;

	const componentID = getNextID(model);
	agency.components.push({
		id: componentID,
		type: choice.componentDefinitionID,
		damaged: false,
	});

	return [];
};
