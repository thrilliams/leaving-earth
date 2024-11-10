import type { BaseDecision } from "../Decision";

export interface TakeActionDecision extends BaseDecision {
	type: "take_action";
	firstOfTurn?: boolean;
}
