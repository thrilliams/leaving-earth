import type { AdvancementID } from "@state/model/advancement/Advancement";
import type { AgencyID } from "@state/model/Agency";
import type { ComponentID } from "@state/model/component/Component";
import type { SpacecraftID } from "@state/model/Spacecraft";

export interface ResourceTransfer {
	from: AgencyID;
	to: AgencyID;
	funds: number;
	components: ComponentID[];
	spacecraft: SpacecraftID[];
	advancements: AdvancementID[];
}
