import type { MatchReadonly, MaybeDraft } from "laika-engine";
import type { ManeuverHazard, ManeuverHazardType, Model } from "../../model";
import {
	ManeuverID,
	maneuverIDPattern,
	originDestinationTuple,
} from "../model/location/maneuver/Maneuver";
import { getLocation } from "./location";
import { predicate, selector } from "./wrappers";

export const getManeuverOriginAndDestination = predicate(
	(model, maneuverID: ManeuverID) => {
		const match = maneuverIDPattern.exec(maneuverID);
		if (match === null) throw new Error("failed to parse maneuver id");
		return originDestinationTuple(model.expansions).parse(match.slice(1));
	}
);

/**
 * returns the origin component of a maneuver ID, or errors if it cannot be resolved
 */
export const getManeuverOrigin = predicate((model, maneuverID: ManeuverID) => {
	const [originID] = getManeuverOriginAndDestination(model, maneuverID);
	return originID;
});

/**
 * returns the maneuver with the given ID, or errors if none exists
 */
export const getManeuver = selector((model, maneuverID: ManeuverID) => {
	const [originID, destinationID] = getManeuverOriginAndDestination(
		model,
		maneuverID
	);
	const origin = getLocation(model, originID);

	const maneuver = origin.maneuvers.find(
		(maneuver) => maneuver.destinationID === destinationID
	);
	if (maneuver !== undefined) return maneuver;

	throw new Error("maneuver ID could not be resolved");
});

export const getManeuverHazardsOfType = <
	M extends MaybeDraft<Model>,
	T extends ManeuverHazardType
>(
	model: M,
	maneuverID: ManeuverID,
	profileIndex: number,
	hazardType: T
) => {
	const maneuver = getManeuver(model, maneuverID);
	const profile = maneuver.profiles[profileIndex];
	const matchingHazards = profile.hazards.filter(
		({ type }) => type === hazardType
	);

	if (matchingHazards.length === 0) return undefined;
	return matchingHazards as MatchReadonly<M, ManeuverHazard & { type: T }>[];
};

export function modifyManeuverDifficultyAndDuration(
	duration: number,
	difficulty: number,
	durationModifier: number
) {
	if (durationModifier > 0) duration += durationModifier;
	if (durationModifier < 0) {
		for (let i = durationModifier; i < 0; i++) {
			duration = Math.ceil(duration / 2);
			difficulty *= 2;
		}
	}

	return { duration, difficulty };
}

export const getManeuverDuration = selector(
	(model, maneuverID: ManeuverID, profileIndex: number) => {
		const durationEffect = getManeuverHazardsOfType(
			model,
			maneuverID,
			profileIndex,
			"duration"
		)?.at(0);

		return durationEffect?.years;
	}
);
