import type { ComponentID } from "../../model/component/Component";
import type { BaseInterrupt } from "../Interrupt";

export type StartOfYearStep =
	| "give_funding"
	| "turn_in_valuable_samples"
	| "turn_in_alien_samples"
	| "complete_missions"
	| "determine_turn_order";

export interface StartOfYearInterrupt extends BaseInterrupt {
	type: "start_of_year";
	step: StartOfYearStep;
	remainingComponentIDs?: ComponentID[];
}
