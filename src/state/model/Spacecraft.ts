import type { ComponentID } from "./component/Component";
import { GenericID } from "./GenericID";
import type { LocationID } from "./location/Location";
import type { ManeuverID } from "./location/maneuver/Maneuver";

export const SpacecraftID = GenericID;
export type SpacecraftID = GenericID;

export interface Spacecraft {
	id: SpacecraftID;
	locationID: LocationID;
	componentIDs: ComponentID[];
	// number of time counters on spacecraft (i.e. after multi-year maneuvers)
	years: number;
	maneuverID?: ManeuverID;
}
