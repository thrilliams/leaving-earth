import { resolveEndOfYear } from "../year/resolveEndOfYear";
import type { InterruptReducer } from "../../game";

export const reduceEndOfYearInterrupt: InterruptReducer<"end_of_year"> = (
	model,
	interrupt,
	logger
) =>
	resolveEndOfYear(
		model,
		logger,
		interrupt.step,
		interrupt.remainingSpacecraftIDs &&
			interrupt.remainingSpacecraftIDs.length > 0
			? [...interrupt.remainingSpacecraftIDs]
			: undefined
	);
