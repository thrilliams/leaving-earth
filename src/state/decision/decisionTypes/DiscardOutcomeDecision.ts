import type { AdvancementID } from "@state/model/advancement/Advancement";
import type { Outcome } from "@state/model/advancement/Outcome";
import type { ComponentID } from "@state/model/component/Component";
import type { SpacecraftID } from "@state/model/Spacecraft";
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
