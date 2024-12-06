import { resolveLifeSupport } from "../year/resolveLifeSupport";
import type { InterruptReducer } from "../../game";

export const reduceLifeSupportInterrupt: InterruptReducer<"life_support"> = (
	model,
	interrupt,
	logger
) =>
	resolveLifeSupport(
		model,
		logger,
		interrupt.agencyID,
		interrupt.spacecraftID,
		[...interrupt.remainingComponents],
		[...interrupt.functionalComponents]
	);
