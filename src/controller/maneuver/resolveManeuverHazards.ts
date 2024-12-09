import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../game";
import { type Decision } from "../../state/decision/Decision";
import type { ManeuverInformation } from "../../state/decision/maneuverInformation/ManeuverInformation";
import { getManeuver } from "../../state/helpers/maneuver";
import {
	doesSpacecraftExist,
	getSpacecraft,
} from "../../state/helpers/spacecraft";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { Model } from "../../state/model/Model";
import { completeLocationMissions } from "../helpers/mission";
import { moveSpacecraftToManeuverDestination } from "../helpers/spacecraft";
import { resolveAerobraking } from "./hazards/resolveAerobraking";
import { resolveDuration } from "./hazards/resolveDuration";
import { resolveLanding } from "./hazards/resolveLanding";
import { resolveLocation } from "./hazards/resolveLocation";
import { resolveReEntry } from "./hazards/resolveReEntry";

function resolveManeuverHazardByType(
	model: Draft<Model>,
	logger: Logger<Game>,
	maneuverInformation: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const maneuver = getManeuver(model, maneuverInformation.maneuverID);
	const profile = maneuver.profiles[maneuverInformation.profileIndex];
	const hazard = profile.hazards[maneuverInformation.nextHazardIndex];

	if (hazard.type === "duration")
		return resolveDuration(model, logger, maneuverInformation);
	if (hazard.type === "re_entry")
		return resolveReEntry(model, logger, maneuverInformation);
	if (hazard.type === "landing")
		return resolveLanding(model, logger, maneuverInformation);
	if (hazard.type === "location")
		return resolveLocation(model, logger, maneuverInformation);
	// outer planets
	if (hazard.type === "aerobraking")
		return resolveAerobraking(model, logger, maneuverInformation);

	throw new Error("unexpected hazard type!");
}

export function resolveManeuverHazards(
	model: Draft<Model>,
	logger: Logger<Game>,
	maneuverInformation: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const spacecraft = getSpacecraft(model, maneuverInformation.spacecraftID);
	const maneuver = getManeuver(model, maneuverInformation.maneuverID);
	const profile = maneuver.profiles[maneuverInformation.profileIndex];

	for (
		let i = maneuverInformation.nextHazardIndex;
		i < profile.hazards.length;
		i++
	) {
		if (spacecraft.years > 0) return [];
		if (!doesSpacecraftExist(model, maneuverInformation.spacecraftID)) {
			logger("before")`${[
				"spacecraft",
				maneuverInformation.spacecraftID,
			]} failed to complete ${[
				"maneuver",
				maneuverInformation.maneuverID,
				maneuverInformation.profileIndex,
			]}`;

			return [];
		}

		const hazard = profile.hazards[i];
		logger("before")`${[
			"spacecraft",
			maneuverInformation.spacecraftID,
		]} encountering ${["string", hazard.type]} for ${[
			"maneuver",
			maneuverInformation.maneuverID,
			maneuverInformation.profileIndex,
		]}`;

		const [decision, ...next] = resolveManeuverHazardByType(model, logger, {
			...maneuverInformation,
			nextHazardIndex: i,
		});

		if (decision) return [decision, ...next];
	}

	if (spacecraft.years === 0)
		logger("before")`${[
			"spacecraft",
			maneuverInformation.spacecraftID,
		]} completed ${[
			"maneuver",
			maneuverInformation.maneuverID,
			maneuverInformation.profileIndex,
		]}`;

	if (spacecraft.locationID !== maneuver.destinationID) {
		moveSpacecraftToManeuverDestination(
			model,
			logger,
			maneuverInformation.spacecraftID,
			maneuver.destinationID,
			true
		);
	} else {
		completeLocationMissions(
			model,
			logger,
			maneuverInformation.spacecraftID
		);
	}

	return [];
}
