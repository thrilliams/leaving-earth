import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../../game";
import {
	getManeuver,
	getSpacecraft,
	modifyManeuverDifficultyAndDuration,
} from "../../../helpers";
import type {
	Decision,
	Interrupt,
	ManeuverInformation,
	Model,
} from "../../../model";
import { moveSpacecraftToManeuverDestination } from "../../helpers/spacecraft";

export function resolveDuration(
	model: Draft<Model>,
	logger: Logger<Game>,
	maneuverInformation: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const maneuver = getManeuver(model, maneuverInformation.maneuverID);
	const profile = maneuver.profiles[maneuverInformation.profileIndex];

	const durationHazard = profile.hazards[maneuverInformation.nextHazardIndex];
	if (durationHazard.type !== "duration")
		throw new Error("expected duration hazard effect");

	const { duration } = modifyManeuverDifficultyAndDuration(
		durationHazard.years || 0,
		profile.difficulty || 0,
		maneuverInformation.durationModifier
	);

	const spacecraft = getSpacecraft(model, maneuverInformation.spacecraftID);
	spacecraft.years += duration;

	logger("before")`${[
		"spacecraft",
		maneuverInformation.spacecraftID,
	]} will complete ${[
		"maneuver",
		maneuverInformation.maneuverID,
		maneuverInformation.profileIndex,
	]} in ${["number", spacecraft.years]} ${[
		"string",
		duration !== 1 ? "years" : "year",
	]}`;

	moveSpacecraftToManeuverDestination(
		model,
		logger,
		maneuverInformation.spacecraftID,
		maneuver.destinationID,
		false
	);

	spacecraft.maneuverID = maneuverInformation.maneuverID;
	spacecraft.profileIndex = maneuverInformation.profileIndex;

	return [];
}
