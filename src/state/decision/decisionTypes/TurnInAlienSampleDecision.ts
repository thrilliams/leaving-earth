import type { ComponentID } from "../../model/component/Component";
import type { BaseDecision } from "../Decision";

export interface TurnInAlienSampleDecision extends BaseDecision {
	type: "turn_in_alien_sample";
	sampleID: ComponentID;
}
