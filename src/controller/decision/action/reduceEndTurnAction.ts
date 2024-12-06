import { getAgency } from "../../../state/helpers/agency";
import { resolveEndOfTurnManeuvers } from "../../year/resolveEndOfTurnManeuvers";
import type { TakeActionReducer } from "../reduceTakeActionDecision";

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

	return resolveEndOfTurnManeuvers(
		model,
		logger,
		decision.agencyID,
		agency.spacecraft.map(({ id }) => id)
	);
};
