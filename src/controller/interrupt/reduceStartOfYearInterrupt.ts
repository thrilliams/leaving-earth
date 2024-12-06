import { resolveStartOfYear } from "../year/resolveStartOfYear";
import type { InterruptReducer } from "../../game";

export const reduceStartOfYearInterrupt: InterruptReducer<"start_of_year"> = (
	model,
	interrupt,
	logger
) =>
	resolveStartOfYear(
		model,
		logger,
		interrupt.step,
		interrupt.remainingComponentIDs &&
			interrupt.remainingComponentIDs.length > 0
			? [...interrupt.remainingComponentIDs]
			: undefined
	);
