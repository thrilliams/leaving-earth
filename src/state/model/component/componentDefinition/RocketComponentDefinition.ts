import type { AdvancementComponentDefinition } from "./AdvancementComponentDefinition";
import type { MassComponentDefinition } from "./MassComponentDefinition";

export interface RocketComponentDefinition
	extends AdvancementComponentDefinition,
		MassComponentDefinition {
	id:
		| "juno_rocket"
		| "atlas_rocket"
		| "soyuz_rocket"
		| "saturn_rocket"
		| "proton_rocket";
	type: "rocket";
	thrust: number;
}
