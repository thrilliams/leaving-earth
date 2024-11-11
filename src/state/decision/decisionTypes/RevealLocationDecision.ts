import type { SpacecraftID } from "../../model/Spacecraft";
import type { LocationHazard } from "../../model/location/locationHazard/LocationHazard";
import type { BaseDecision } from "../Decision";
import type { LocationID } from "../../model/location/Location";

export interface RevealLocationDecision extends BaseDecision {
	type: "reveal_location";
	spacecraftID: SpacecraftID;
	locationID: LocationID;
	// not functional, for providing context
	locationHazard: LocationHazard | null;
}
