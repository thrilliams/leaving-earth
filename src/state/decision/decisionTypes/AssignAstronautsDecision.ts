import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseDecision } from "../Decision";

export interface AssignAstronautsDecision extends BaseDecision {
	type: "assign_astronauts";
	spacecraftID: SpacecraftID;
}
