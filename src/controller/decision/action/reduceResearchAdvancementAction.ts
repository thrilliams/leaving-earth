import { giveAdvancement } from "../../helpers/advancement";
import type { TakeActionReducer } from "../reduceTakeActionDecision";
import { getAgency } from "../../../state/helpers/agency";

export const reduceResearchAdvancementAction: TakeActionReducer<
	"research_advancement"
> = (model, decision, choice) => {
	giveAdvancement(model, decision.agencyID, choice.advancementID);

	const agency = getAgency(model, decision.agencyID);
	agency.funds -= 10;

	return [];
};
