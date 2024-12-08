import type { AdvancementID } from "../../advancement/Advancement";
import type { MassComponentDefinition } from "./MassComponentDefinition";
import type { PurchasableComponentDefinition } from "./PurchasableComponentDefinition";
import type { RadiationShieldedComponentDefinition } from "./RadiationShieldedComponentDefinition";

export interface ProbeComponentDefinition
	extends PurchasableComponentDefinition,
		MassComponentDefinition,
		RadiationShieldedComponentDefinition {
	id: "probe" | "galileo_probe";
	advancementID?: AdvancementID;
	type: "probe";
}
