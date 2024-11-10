import { getAgency } from "@state/helpers/agency";
import { getNextID } from "@controller/helpers/id";
import type { TakeActionReducer } from "@controller/decision/reduceTakeActionDecision";

export const reduceAssembleSpacecraftAction: TakeActionReducer<
	"assemble_spacecraft"
> = (model, decision, choice) => {
	const agency = getAgency(model, decision.agencyID);

	const spacecraftID = getNextID(model);
	agency.spacecraft.push({
		id: spacecraftID,
		locationID: "earth",
		componentIDs: [...choice.componentIDs],
		years: 0,
	});

	return [];
};
