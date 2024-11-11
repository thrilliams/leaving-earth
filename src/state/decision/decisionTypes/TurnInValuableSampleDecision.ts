import type { ComponentID } from "../../model/component/Component";
import type { BaseDecision } from "../Decision";

export interface TurnInValuableSampleDecision extends BaseDecision {
	type: "turn_in_valuable_sample";
	sampleID: ComponentID;
}
