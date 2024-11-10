import type { SpacecraftID } from "@state/model/Spacecraft";
import type { BaseDecision } from "../Decision";

export interface LifeSupportDecision extends BaseDecision {
	type: "life_support";
	spacecraftID: SpacecraftID;
	capacity: number;
}
