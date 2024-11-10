import type { MassComponentDefinition } from "./MassComponentDefinition";
import type { PurchasableComponentDefinition } from "./PurchasableComponentDefinition";

export interface ProbeComponentDefinition
	extends PurchasableComponentDefinition,
		MassComponentDefinition {
	id: "probe";
	type: "probe";
}
