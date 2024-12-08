import type { AdvancementComponentDefinition } from "./AdvancementComponentDefinition";
import type { MassComponentDefinition } from "./MassComponentDefinition";
import type { RadiationShieldedComponentDefinition } from "./RadiationShieldedComponentDefinition";

export interface CapsuleComponentDefinition
	extends AdvancementComponentDefinition,
		MassComponentDefinition,
		RadiationShieldedComponentDefinition {
	id:
		| "vostok_capsule"
		| "apollo_capsule"
		| "eagle_capsule"
		| "aldrin_capsule";
	type: "capsule";
	capacity: number;
	heatShields: boolean;
}
