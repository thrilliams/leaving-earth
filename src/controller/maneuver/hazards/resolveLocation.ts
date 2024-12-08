import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../../game";
import {
	doesSpacecraftHaveAstronaut,
	getLocation,
	getManeuver,
	getManeuverDuration,
	modifyManeuverDifficultyAndDuration,
} from "../../../helpers";
import type {
	Decision,
	Interrupt,
	ManeuverInformation,
	Model,
} from "../../../model";
import { revealLocation } from "../../helpers/location";
import { encounterLocation } from "./encounterLocation";

export function resolveLocation(
	model: Draft<Model>,
	logger: Logger<Game>,
	maneuverInformation: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const maneuver = getManeuver(model, maneuverInformation.maneuverID);
	const profile = maneuver.profiles[maneuverInformation.profileIndex];

	const locationHazard = profile.hazards[maneuverInformation.nextHazardIndex];
	if (locationHazard.type !== "location")
		throw new Error("expected location hazard effect");

	const locationID = locationHazard.locationID;
	const location = getLocation(model, locationID);
	if (!location.explorable)
		throw new Error("maneuver location hazard must be explorable!");

	if (!location.revealed) {
		// if i.e. suborbital flight and spacecraft has astronauts,
		// optionally hide information from other players
		if (location.astronautOnly) {
			if (
				doesSpacecraftHaveAstronaut(
					model,
					maneuverInformation.spacecraftID
				)
			)
				return [
					{
						type: "reveal_location",
						agencyID: maneuverInformation.agencyID,
						spacecraftID: maneuverInformation.spacecraftID,
						locationID,
						locationHazard: location.hazard,
					},
					{
						kind: "interrupt",
						value: {
							type: "continue_maneuver",
							...maneuverInformation,
						},
					},
				];
		} else {
			// non-astronaut-only locations reveal unconditionally
			revealLocation(
				model,
				logger,
				locationID,
				maneuverInformation.agencyID
			);
		}
	}

	const profileDuration = getManeuverDuration(
		model,
		maneuverInformation.maneuverID,
		maneuverInformation.profileIndex
	);
	const { duration } = modifyManeuverDifficultyAndDuration(
		profileDuration || 0,
		profile.difficulty || 0,
		maneuverInformation.durationModifier
	);

	return encounterLocation(
		model,
		logger,
		maneuverInformation.agencyID,
		maneuverInformation.spacecraftID,
		locationID,
		duration,
		0
	);
}
