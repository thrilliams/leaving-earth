import type { AdvancementComponentDefinition } from "./AdvancementComponentDefinition";
import type { MassComponentDefinition } from "./MassComponentDefinition";

export interface SuppliesComponentDefinition
	extends AdvancementComponentDefinition,
		MassComponentDefinition {
	id: "supplies";
	type: "supplies";
}
