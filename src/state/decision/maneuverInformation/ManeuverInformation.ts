import type { AgencyID } from "@state/model/Agency";
import type { ComponentID } from "@state/model/component/Component";
import type { ManeuverID } from "@state/model/location/maneuver/Maneuver";
import type { ManeuverHazardType } from "@state/model/location/maneuver/ManeuverHazard";
import type { SpacecraftID } from "@state/model/Spacecraft";

// represents the information needed to store a maneuver during its resolution
export interface ManeuverInformation {
	agencyID: AgencyID;
	spacecraftID: SpacecraftID;
	maneuverID: ManeuverID;
	durationModifier: number;
	rocketIDs: ComponentID[];
	spentRocketIDs: ComponentID[];
	generatedThrust: number;
	nextHazard: ManeuverHazardType;
	astronautsAssigned: boolean;
}
