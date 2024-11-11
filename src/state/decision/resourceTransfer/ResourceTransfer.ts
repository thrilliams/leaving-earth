import type { AdvancementID } from "../../model/advancement/Advancement";
import type { AgencyID } from "../../model/Agency";
import type { ComponentID } from "../../model/component/Component";
import type { SpacecraftID } from "../../model/Spacecraft";

export interface ResourceTransfer {
	from: AgencyID;
	to: AgencyID;
	funds: number;
	components: ComponentID[];
	spacecraft: SpacecraftID[];
	advancements: AdvancementID[];
}
