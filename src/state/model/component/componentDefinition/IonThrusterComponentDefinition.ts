import type { AdvancementComponentDefinition } from "./AdvancementComponentDefinition";
import type { MassComponentDefinition } from "./MassComponentDefinition";

export interface IonThrusterComponentDefinition
	extends AdvancementComponentDefinition,
		MassComponentDefinition {
	id: "ion_thruster";
	type: "ion_thruster";
	thrustPerYear: number;
}
