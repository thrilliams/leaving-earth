import type { ManeuverHazard, ManeuverHazardType } from "./ManeuverHazard";
import { LocationID } from "../Location";
import { z } from "zod";
import type { ExpansionID } from "../../../expansion/ExpansionID";
import type { MaybeDraft } from "laika-engine";

export const maneuverIDPattern = /^(.*)_to_(.*)$/;
export const originDestinationTuple = (expansions: MaybeDraft<ExpansionID[]>) =>
	z.tuple([
		LocationID(expansions),
		LocationID(expansions).or(z.literal("lost")),
	]);

export type ManeuverID = `${LocationID}_to_${LocationID | "lost"}`;

export const ManeuverID = (expansions: MaybeDraft<ExpansionID[]>) =>
	z.custom<ManeuverID>((value) => {
		if (typeof value !== "string") return false;
		const match = maneuverIDPattern.exec(value);
		if (match === null) return false;
		const { success } = originDestinationTuple(expansions).safeParse(
			match.slice(1)
		);
		return success;
	});

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
