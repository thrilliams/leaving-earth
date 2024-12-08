import type { SpacecraftID } from "../../model/Spacecraft";
import type { LocationHazard } from "../../model/location/locationHazard/LocationHazard";
import type { BaseDecision } from "../Decision";
import type { LocationID } from "../../model/location/Location";
import type { ComponentID } from "../../../model";

export interface RevealLocationDecision extends BaseDecision {
	type: "reveal_location";
	spacecraftID: SpacecraftID;
	locationID: LocationID;
	componentID?: ComponentID;
	// not functional, for providing context
	locationHazard: LocationHazard;
}
