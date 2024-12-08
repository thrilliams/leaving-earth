import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../game";
import { getLocation, getSpacecraft } from "../../helpers";
import type {
	AgencyID,
	Decision,
	Interrupt,
	Model,
	SpacecraftID,
} from "../../model";
import { resolveManeuver } from "../maneuver/resolveManeuver";
import { resolveEndOfYear } from "./resolveEndOfYear";

export function resolveEndOfTurnManeuvers(
	model: Draft<Model>,
	logger: Logger<Game>,
	agencyID: AgencyID,
	remainingSpacecraftIDs: SpacecraftID[]
): ReducerReturnType<Decision, Interrupt> {
	for (let i = 0; i < remainingSpacecraftIDs.length; i++) {
		const spacecraftID = remainingSpacecraftIDs[i];

		const spacecraft = getSpacecraft(model, spacecraftID);
		if (spacecraft.years !== 0) continue;

		const location = getLocation(model, spacecraft.locationID);

		for (const maneuver of location.maneuvers) {
			for (
				let profileIndex = 0;
				profileIndex < maneuver.profiles.length;
				profileIndex++
			) {
				const profile = maneuver.profiles[profileIndex];
				if (profile.difficulty !== null) continue;

				const [decision, ...next] = resolveManeuver(model, logger, {
					agencyID,
					spacecraftID,
					maneuverID: `${location.id}_to_${maneuver.destinationID}`,
					profileIndex,
					durationModifier: 0,
					rocketIDs: [],
					spentRocketIDs: [],
					generatedThrust: 0,
					nextHazardIndex: 0,
				});

				if (decision)
					return [
						decision,
						...next,
						{
							kind: "interrupt",
							value: {
								type: "end_of_turn_maneuvers",
								agencyID,
								remainingSpacecraftIDs:
									remainingSpacecraftIDs.slice(i + 1),
							},
						},
					];

				break;
			}
		}
	}

	const agencyIDs = [];
	let allTurnsPassed = true;
	for (const agency of model.agencies) {
		agencyIDs.push(agency.id);
		if (!agency.passedThisYear) allTurnsPassed = false;
	}

	if (allTurnsPassed) return resolveEndOfYear(model, logger);

	const nextAgencyIndex =
		(agencyIDs.indexOf(agencyID) + 1) % agencyIDs.length;

	return [
		{
			type: "take_action",
			agencyID: agencyIDs[nextAgencyIndex],
			firstOfTurn: true,
		},
	];
}
