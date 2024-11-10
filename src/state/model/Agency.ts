import type { Advancement, AdvancementID } from "./advancement/Advancement";
import type { Component } from "./component/Component";
import { GenericID } from "./GenericID";
import type { Mission } from "./mission/Mission";
import type { Spacecraft } from "./Spacecraft";

export const AgencyID = GenericID;
export type AgencyID = GenericID;

export interface Agency {
	id: AgencyID;

	// resources
	funds: number;
	components: Component[];
	advancements: Partial<Record<AdvancementID, Advancement>>;
	spacecraft: Spacecraft[];

	// scorekeeping
	missions: Mission[];
	deadAstronauts: Component[];

	// technical
	passedThisYear: boolean;
}
