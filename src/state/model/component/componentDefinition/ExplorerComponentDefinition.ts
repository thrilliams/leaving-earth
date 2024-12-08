import type { AdvancementComponentDefinition } from "./AdvancementComponentDefinition";
import type { MassComponentDefinition } from "./MassComponentDefinition";

export interface ExplorerComponentDefinition
	extends AdvancementComponentDefinition,
		MassComponentDefinition {
	id: "explorer_payload";
	type: "explorer";
}
