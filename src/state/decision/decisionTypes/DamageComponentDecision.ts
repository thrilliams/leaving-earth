import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseDecision } from "../Decision";

export interface DamageComponentDecision extends BaseDecision {
	type: "damage_component";
	spacecraftID: SpacecraftID;
	secondSpacecraftID?: SpacecraftID;
}
