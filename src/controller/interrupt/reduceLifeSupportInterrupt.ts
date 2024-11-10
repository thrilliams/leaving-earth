import { resolveLifeSupport } from "@controller/year/resolveLifeSupport";
import type { InterruptReducer } from "src/game";

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
