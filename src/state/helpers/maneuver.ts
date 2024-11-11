import {
	maneuverIDPattern,
	originDestinationTuple,
	type ManeuverID,
} from "../model/location/maneuver/Maneuver";
import { getLocation } from "./location";
import { predicate, selector } from "./wrappers";

export const getManeuverOriginAndDestination = (maneuverID: ManeuverID) => {
	const match = maneuverIDPattern.exec(maneuverID);
	if (match === null) throw new Error("failed to parse maneuver id");
	return originDestinationTuple.parse(match);
};

/**
 * returns the origin component of a maneuver ID, or errors if it cannot be resolved
 */
export const getManeuverOrigin = predicate((_model, maneuverID: ManeuverID) => {
	const [originID] = getManeuverOriginAndDestination(maneuverID);
	return originID;
});

/**
 * returns the maneuver with the given ID, or errors if none exists
 */
export const getManeuver = selector((model, maneuverID: ManeuverID) => {
	const [originID, destinationID] =
		getManeuverOriginAndDestination(maneuverID);
	const origin = getLocation(model, originID);

	const maneuver = origin.maneuvers.find(
		(maneuver) => maneuver.destinationID === destinationID
	);
	if (maneuver !== undefined) return maneuver;

	throw new Error("maneuver ID could not be resolved");
});
