import type { PurchasableComponentDefinition } from "./PurchasableComponentDefinition";

export type AstronautSpeciality = "mechanic" | "doctor" | "pilot";

export interface AstronautComponentDefinition
	extends PurchasableComponentDefinition {
	id: "mechanic_astronaut" | "doctor_astronaut" | "pilot_astronaut";
	type: "astronaut";
	speciality: AstronautSpeciality;
}
