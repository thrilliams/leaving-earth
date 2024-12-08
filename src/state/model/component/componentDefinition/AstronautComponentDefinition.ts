import type { PurchasableComponentDefinition } from "./PurchasableComponentDefinition";

export type AstronautSpeciality =
	| "mechanic"
	| "doctor"
	| "pilot"
	// outer planets
	| "scientist";

export interface AstronautComponentDefinition
	extends PurchasableComponentDefinition {
	id:
		| "mechanic_astronaut"
		| "doctor_astronaut"
		| "pilot_astronaut"
		| "scientist_astronaut";
	type: "astronaut";
	speciality: AstronautSpeciality;
}
