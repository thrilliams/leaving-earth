import { z } from "zod";
import type { LocationID } from "../Location";

export const ManeuverHazardType = z.enum([
	"radiation",
	"re_entry",
	"landing",
	"location",
]);

export type ManeuverHazardType = z.infer<typeof ManeuverHazardType>;

export interface BaseManeuverHazard {
	type: ManeuverHazardType;
}

export interface RadiationManeuverHazard extends BaseManeuverHazard {
	type: "radiation";
}

export interface ReEntryManeuverHazard extends BaseManeuverHazard {
	type: "re_entry";
}

export interface LandingManeuverHazard extends BaseManeuverHazard {
	type: "landing";
	optional: boolean;
}

export interface LocationManeuverHazard extends BaseManeuverHazard {
	type: "location";
	locationID: LocationID;
}

export type ManeuverHazard =
	| RadiationManeuverHazard
	| ReEntryManeuverHazard
	| LandingManeuverHazard
	| LocationManeuverHazard;
