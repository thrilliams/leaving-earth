import type { AgencyID } from "../../model/Agency";
import type { ComponentID } from "../../model/component/Component";
import type { ManeuverID } from "../../model/location/maneuver/Maneuver";
import type { SpacecraftID } from "../../model/Spacecraft";

// represents the information needed to store a maneuver during its resolution
export interface ManeuverInformation {
	agencyID: AgencyID;
	spacecraftID: SpacecraftID;
	maneuverID: ManeuverID;
	profileIndex: number;
	durationModifier: number;
	rocketIDs: ComponentID[];
	spentRocketIDs: ComponentID[];
	generatedThrust: number;
	nextHazardIndex: number;
}
