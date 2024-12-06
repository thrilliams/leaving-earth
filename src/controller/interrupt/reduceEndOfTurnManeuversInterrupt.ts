import type { InterruptReducer } from "../../game";
import { resolveEndOfTurnManeuvers } from "../year/resolveEndOfTurnManeuvers";

export const reduceEndOfTurnManeuversInterrupt: InterruptReducer<
	"end_of_turn_maneuvers"
> = (model, interrupt, logger) =>
	resolveEndOfTurnManeuvers(model, logger, interrupt.agencyID, [
		...interrupt.remainingSpacecraftIDs,
	]);
