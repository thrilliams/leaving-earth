import { getAgency } from "../../../state/helpers/agency";
import type { TakeActionReducer } from "../reduceTakeActionDecision";
import { resolveEndOfYear } from "../../year/resolveEndOfYear";

export const reduceEndTurnAction: TakeActionReducer<"end_turn"> = (
	model,
	decision,
	choice,
	logger
) => {
	if (choice.pass) {
		logger("before")`${[
			"agency",
			decision.agencyID,
		]} passed their turn for the round`;
	} else {
		logger("before")`${["agency", decision.agencyID]} ended their turn`;
	}

	const agency = getAgency(model, decision.agencyID);
	agency.passedThisYear = choice.pass;

	const agencyIDs = [];

	let allTurnsPassed = true;
	for (const agency of model.agencies) {
		agencyIDs.push(agency.id);
		if (!agency.passedThisYear) allTurnsPassed = false;
	}

	if (allTurnsPassed) return resolveEndOfYear(model, logger);

	const nextAgencyIndex =
		(agencyIDs.indexOf(decision.agencyID) + 1) % agencyIDs.length;

	return [
		{
			type: "take_action",
			agencyID: agencyIDs[nextAgencyIndex],
			firstOfTurn: true,
		},
	];
};
