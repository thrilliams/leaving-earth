import type { MaybeDraft } from "laika-engine";
import { z } from "zod";
import type { ExpansionID } from "../../../expansion/ExpansionID";
import { LocationID } from "../Location";
import type { ManeuverHazard } from "./ManeuverHazard";

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

export interface ManeuverProfile {
	// `null` represents an automatic, end-of-turn maneuver, while `0`
	// represents a maneuver that requires no thrust
	difficulty: number | null;
	hazards: ManeuverHazard[];
	// outer planets
	slingshot?: LocationID;
}

export interface Maneuver {
	destinationID: LocationID | "lost";
	profiles: ManeuverProfile[];
}
