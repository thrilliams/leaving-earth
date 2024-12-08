import type { ManeuverInformation } from "../../../model";
import type { BaseDecision } from "../../decision/Decision";

export interface ContinueManeuverInterrupt
	extends BaseDecision,
		ManeuverInformation {
	type: "continue_maneuver";
}
