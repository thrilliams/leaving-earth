import type { ManeuverHazard, ManeuverHazardType } from "./ManeuverHazard";
import { LocationID } from "../Location";
import { z } from "zod";

const maneuverIDPattern = /^(.*)_to_(.*)$/;
const originDestinationTuple = z.tuple([
	LocationID,
	LocationID.or(z.literal("lost")),
]);

export type ManeuverID = `${LocationID}_to_${LocationID | "lost"}`;

export const ManeuverID = z.custom<ManeuverID>((value) => {
	if (typeof value !== "string") return false;
	const match = maneuverIDPattern.exec(value);
	if (match === null) return false;
	const { success } = originDestinationTuple.safeParse(match);
	return success;
});

export const getManeuverOriginAndDestination = (maneuverID: ManeuverID) => {
	const match = maneuverIDPattern.exec(maneuverID);
	if (match === null) throw new Error("failed to parse maneuver id");
	return originDestinationTuple.parse(match);
};

export interface Maneuver {
	// `null` represents a maneuver that leads to "lost"
	destinationID: LocationID | "lost";

	// `null` represents an automatic, end-of-year maneuver, while `0`
	// represents a free maneuver
	difficulty: number | null;

	// `null` represents a maneuver with an optional duration
	duration?: number | null;

	hazards: Partial<{
		[T in ManeuverHazardType]: ManeuverHazard & { type: T };
	}>;
}
