import type { SpacecraftID } from "@state/model/Spacecraft";
import type { LocationHazard } from "@state/model/location/locationHazard/LocationHazard";
import type { BaseDecision } from "../Decision";
import type { LocationID } from "@state/model/location/Location";

export interface RevealLocationDecision extends BaseDecision {
	type: "reveal_location";
	spacecraftID: SpacecraftID;
	locationID: LocationID;
	// not functional, for providing context
	locationHazard: LocationHazard | null;
}
