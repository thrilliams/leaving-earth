import type { SpacecraftID } from "../../model/Spacecraft";
import type { BaseInterrupt } from "../Interrupt";
import type { AgencyID } from "../../model/Agency";
import type { ComponentID } from "../../model/component/Component";

export interface EncounterReEntryInterrupt extends BaseInterrupt {
	type: "encounter_re_entry";
	agencyID: AgencyID;
	spacecraftID: SpacecraftID;
	componentIDs: ComponentID[];
}
