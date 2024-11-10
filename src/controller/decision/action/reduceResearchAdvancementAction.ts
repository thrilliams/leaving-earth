import { giveAdvancement } from "@controller/helpers/advancement";
import type { TakeActionReducer } from "@controller/decision/reduceTakeActionDecision";
import { getAgency } from "@state/helpers/agency";

export const reduceResearchAdvancementAction: TakeActionReducer<
	"research_advancement"
> = (model, decision, choice) => {
	giveAdvancement(model, decision.agencyID, choice.advancementID);

	const agency = getAgency(model, decision.agencyID);
	agency.funds -= 10;

	return [];
};
