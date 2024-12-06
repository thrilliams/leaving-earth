import { z } from "zod";
import type { LocationHazard } from "./locationHazard/LocationHazard";
import type { Maneuver } from "./maneuver/Maneuver";
import type { ExpansionID } from "../../expansion/ExpansionID";
import type { MaybeDraft } from "laika-engine";

const baseGameLocationIDs = [
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
] as const;

const mercuryLocationIDs = [
	"mercury_fly_by",
	"mercury_orbit",
	"mercury",
] as const;

export const LocationID = (expansions: MaybeDraft<ExpansionID[]>) =>
	z
		.enum([...baseGameLocationIDs, ...mercuryLocationIDs])
		.refine((locationID) => {
			if (
				baseGameLocationIDs.includes(
					locationID as (typeof baseGameLocationIDs)[number]
				)
			)
				return true;

			if (
				mercuryLocationIDs.includes(
					locationID as (typeof mercuryLocationIDs)[number]
				)
			)
				return expansions.includes("mercury");
		});

export type LocationID = z.infer<ReturnType<typeof LocationID>>;

export type ExplorableLocationID =
	| "solar_radiation"
	| "suborbital_flight"
	| "moon"
	| "phobos"
	| "mars"
	| "venus"
	| "ceres"
	| "mercury";

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
