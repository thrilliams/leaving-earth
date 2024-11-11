import { resolveLifeSupport } from "../year/resolveLifeSupport";
import type { InterruptReducer } from "../../game";

export const reduceLifeSupportInterrupt: InterruptReducer<"life_support"> = (
	model,
	interrupt
) =>
	resolveLifeSupport(
		model,
		interrupt.agencyID,
		interrupt.spacecraftID,
		[...interrupt.remainingComponents],
		[...interrupt.functionalComponents]
	);
