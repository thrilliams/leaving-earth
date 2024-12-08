import type { InterruptReducer } from "../../game";
import { resolveManeuver } from "../maneuver/resolveManeuver";

export const reduceContinueManeuverInterrupt: InterruptReducer<
	"continue_maneuver"
> = (model, interrupt, logger) =>
	resolveManeuver(model, logger, {
		agencyID: interrupt.agencyID,
		spacecraftID: interrupt.spacecraftID,
		maneuverID: interrupt.maneuverID,
		profileIndex: interrupt.profileIndex,
		durationModifier: interrupt.durationModifier,
		rocketIDs: [...interrupt.rocketIDs],
		spentRocketIDs: [...interrupt.spentRocketIDs],
		generatedThrust: interrupt.generatedThrust,
		nextHazardIndex: interrupt.nextHazardIndex,
	});
