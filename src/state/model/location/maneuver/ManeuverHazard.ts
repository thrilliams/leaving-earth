import type { LocationID } from "../Location";

export type ManeuverHazardType =
	| "duration"
	| "re_entry"
	| "landing"
	| "location"
	// outer planets
	| "aerobraking";

export interface BaseManeuverHazard {
	type: ManeuverHazardType;
}

export interface DurationManeuverHazard extends BaseManeuverHazard {
	type: "duration";
	// a 0 here represents an optional duration; maneuvers with duration should omit this hazard
	years: number;
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

export interface AerobrakingManeuverHazard extends BaseManeuverHazard {
	type: "aerobraking";
}

export type ManeuverHazard =
	| DurationManeuverHazard
	| ReEntryManeuverHazard
	| LandingManeuverHazard
	| LocationManeuverHazard
	| AerobrakingManeuverHazard;
