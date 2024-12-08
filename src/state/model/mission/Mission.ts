import type { LocationID } from "../location/Location";
import type { ExplorableMissionLetter } from "../location/locationHazard/LocationHazard";

export type MissionID =
	// Easy
	| "sounding_rocket"
	| "artifical_satellite"
	| "man_in_space"
	| "man_in_orbit"
	| "lunar_survey"
	| "mars_survey"
	// Medium
	| "lunar_lander"
	| "mars_lander"
	| "venus_lander"
	| "ceres_lander"
	| "man_on_the_moon"
	| "venus_survey"
	| "space_station"
	| "lunar_sample_return"
	| "phobos_sample_return"
	// Hard
	| "man_on_mars"
	| "man_on_venus"
	| "lunar_station"
	| "mars_station"
	| "venus_station"
	| "mars_sample_return"
	| "venus_sample_return"
	| "ceres_sample_return"
	| "extraterrestrial_life"

	// mercury; medium
	| "mercury_survey"
	| "mercury_lander"
	// hard
	| "mercury_sample_return"

	// outer planets; non-explorable
	| "io_survey"
	| "europa_survey"
	| "ganymede_survey"
	| "callisto_survey"
	| "jupiter_survey"
	| "jupiter_system_survey"
	| "enceladus_survey"
	| "titan_survey"
	| "saturn_survey"
	| "uranus_survey"
	| "neptune_survey"
	| "grand_tour"
	// explorable; io
	| "advanced_io_survey"
	| "io_lander"
	| "io_sample_return"
	// europa
	| "advanced_europa_survey"
	| "europa_lander"
	| "europa_ice_explorer"
	| "europa_sample_return"
	// ganymede
	| "ganymede_lander"
	| "ganymede_sample_return"
	// callisto
	| "callisto_lander"
	// jupiter
	| "jupiter_orbiter"
	| "manned_jupiter_fly_by"
	| "jupiter_station"
	// enceladus
	| "advanced_enceladus_survey"
	| "enceladus_lander"
	| "enceladus_ice_explorer"
	| "enceladus_sample_return"
	// titan
	| "advanced_titan_survey"
	| "titan_lander"
	| "titan_cloud_explorer"
	| "titan_sample_return"
	| "man_on_titan"
	// saturn
	| "saturn_orbiter"
	| "saturn_ring_sample_return"
	| "saturn_station"
	| "manned_saturn_fly_by";

export type MissionType =
	// Easy
	| "lander" // i.e. working probe or capsule at location
	| "manned_mission" // i.e. man to location and back
	| "reveal_location" // i.e. survey
	// Medium
	| "station" // i.e. man at location at start of year
	| "sample_return"
	// Hard
	| "extraterrestrial_life"
	// outer planets
	| "reveal_multiple_locations"
	| "galileo_survey"
	| "discard_explorer"
	| "station_multiple_locations";

export type MissionDifficulty =
	| "easy"
	| "medium"
	| "hard"
	| "non_explorable"
	| "explorable";

export interface BaseMission {
	id: MissionID;
	difficulty: MissionDifficulty;
	type: MissionType;
	points: number;
	// for explorable missions from outer planets
	letters?: ExplorableMissionLetter[];
}

export interface LocationOrSpaceMission extends BaseMission {
	type: "lander" | "manned_mission" | "station";
	// null representing "space", i.e. any location other than earth. used by
	// Sounding Rocket, Man in Space, and Space Station
	locationID: LocationID | null;
}

export interface LocationMission extends BaseMission {
	type:
		| "reveal_location"
		| "sample_return"
		| "galileo_survey"
		| "discard_explorer";
	locationID: LocationID;
}

export interface NonLocationMission extends BaseMission {
	type: "extraterrestrial_life";
}

export interface MultipleLocationMission extends BaseMission {
	type: "reveal_multiple_locations" | "station_multiple_locations";
	locationIDs: LocationID[];
}

export type Mission<T extends MissionType = MissionType> = (
	| LocationOrSpaceMission
	| LocationMission
	| NonLocationMission
	| MultipleLocationMission
) & { type: T };
