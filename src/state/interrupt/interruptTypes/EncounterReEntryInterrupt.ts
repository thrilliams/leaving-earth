import type { SpacecraftID } from "@state/model/Spacecraft";
import type { BaseInterrupt } from "../Interrupt";
import type { AgencyID } from "@state/model/Agency";
import type { ComponentID } from "@state/model/component/Component";

export interface EncounterReEntryInterrupt extends BaseInterrupt {
	type: "encounter_re_entry";
	agencyID: AgencyID;
	spacecraftID: SpacecraftID;
	componentIDs: ComponentID[];
}
