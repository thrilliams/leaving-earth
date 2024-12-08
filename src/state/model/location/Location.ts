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

const outerPlanetsLocationIDs = [
	"outer_transfer",

	"jupiter_fly_by",
	"jupiter_orbit",
	"io",
	"europa",
	"ganymede_orbit",
	"ganymede",
	"callisto",
	"jupiter",

	"saturn_fly_by",
	"saturn_orbit",
	"enceladus",
	"titan_orbit",
	"titan",
	"saturn",

	"uranus_fly_by",
	"uranus",

	"neptune_fly_by",
	"neptune",
] as const;

export const LocationID = (expansions: MaybeDraft<ExpansionID[]>) =>
	z
		.enum([
			...baseGameLocationIDs,
			...mercuryLocationIDs,
			...outerPlanetsLocationIDs,
		])
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

			if (
				outerPlanetsLocationIDs.includes(
					locationID as (typeof outerPlanetsLocationIDs)[number]
				)
			)
				return expansions.includes("outer_planets");
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
	| "mercury"
	| "io"
	| "europa"
	| "ganymede"
	| "callisto"
	| "jupiter"
	| "enceladus"
	| "titan"
	| "saturn"
	| "uranus"
	| "neptune";

export interface BaseLocation {
	id: LocationID;
	maneuvers: Maneuver[];
	explorable: boolean;
	noRendezvousOrRepair?: boolean;
	// also skip life support checks
	freeRepairAndHeal?: boolean;

	// outer planets
	surveyableLocations?: LocationID[];
	endOfYearHazards?: LocationID;
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
