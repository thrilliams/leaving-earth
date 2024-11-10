import type { BaseDecision } from "../Decision";
import type { ManeuverInformation } from "../maneuverInformation/ManeuverInformation";

export interface ContinueManeuverDecision
	extends BaseDecision,
		ManeuverInformation {
	type: "continue_maneuver";
}
