import { z } from "zod";
import type { LocationHazard } from "./locationHazard/LocationHazard";
import type { Maneuver } from "./maneuver/Maneuver";

export const LocationID = z.enum([
	"solar_radiation",

	"earth",
	"suborbital_flight",
	"earth_orbit",

	"lunar_fly_by",
	"lunar_orbit",
	"moon",

	"inner_transfer",

	"mars_fly_by",
	"mars_orbit",
	"phobos",
	"mars",

	"venus_fly_by",
	"venus_orbit",
	"venus",

	"ceres",
]);

export type LocationID = z.infer<typeof LocationID>;

export type ExplorableLocationID =
	| "solar_radiation"
	| "suborbital_flight"
	| "moon"
	| "phobos"
	| "mars"
	| "venus"
	| "ceres";

export interface BaseLocation {
	id: LocationID;
	maneuvers: Maneuver[];
	explorable: boolean;
	noRendezvousOrRepair?: boolean;
	// also skip life support checks
	freeRepairAndHeal?: boolean;
}

export interface NonExplorableLocation extends BaseLocation {
	explorable: false;
}

export interface ExplorableLocation extends BaseLocation {
	explorable: true;
	// only true for suborbital flight. hazard is not revealed by craft without
	// astronauts on board, and can be hidden if exploring astronauts are killed
	astronautOnly?: boolean;
	hazard: LocationHazard;
	revealed: boolean;
}

export type Location<ID extends LocationID = LocationID> = (
	| NonExplorableLocation
	| ExplorableLocation
) & { id: ID };
