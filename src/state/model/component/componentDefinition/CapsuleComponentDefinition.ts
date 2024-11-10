import type { AdvancementComponentDefinition } from "./AdvancementComponentDefinition";
import type { MassComponentDefinition } from "./MassComponentDefinition";

export interface CapsuleComponentDefinition
	extends AdvancementComponentDefinition,
		MassComponentDefinition {
	id:
		| "vostok_capsule"
		| "apollo_capsule"
		| "eagle_capsule"
		| "aldrin_capsule";
	type: "capsule";
	capacity: number;
	heatShields: boolean;
	radiationProtection?: number;
}
