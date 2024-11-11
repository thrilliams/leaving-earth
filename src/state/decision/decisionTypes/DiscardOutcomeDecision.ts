import type { AdvancementID } from "../../model/advancement/Advancement";
import type { Outcome } from "../../model/advancement/Outcome";
import type { ComponentID } from "../../model/component/Component";
import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseDecision } from "../Decision";

export interface DiscardOutcomeDecision extends BaseDecision {
	type: "discard_outcome";
	outcome: Outcome;
	advancementID: AdvancementID;

	// contextual, not actually necessary in logic
	componentID?: ComponentID;
	spacecraftID?: SpacecraftID;
	secondSpacecraftID?: SpacecraftID;
}
