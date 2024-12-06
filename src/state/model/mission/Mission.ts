import type { LocationID } from "../location/Location";

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
	// mercury
	| "mercury_survey" // medium
	| "mercury_lander" // medium
	| "mercury_sample_return"; // hard

export type MissionType =
	// Easy
	| "lander" // i.e. working probe or capsule at location
	| "manned_mission" // i.e. man to location and back
	| "reveal_location" // i.e. survey
	// Medium
	| "station" // i.e. man at location at start of year
	| "sample_return"
	// Hard
	| "extraterrestrial_life";

export type MissionDifficulty = "easy" | "medium" | "hard";

export interface BaseMission {
	id: MissionID;
	difficulty: MissionDifficulty;
	type: MissionType;
	points: number;
}

export interface LocationOrSpaceMission extends BaseMission {
	type: "lander" | "manned_mission" | "station";
	// null representing "space", i.e. any location other than earth. used by
	// Sounding Rocket, Man in Space, and Space Station
	locationID: LocationID | null;
}

export interface LocationMission extends BaseMission {
	type: "reveal_location" | "sample_return";
	locationID: LocationID;
}

export interface NonLocationMission extends BaseMission {
	type: "extraterrestrial_life";
}

export type Mission<T extends MissionType = MissionType> = (
	| LocationOrSpaceMission
	| LocationMission
	| NonLocationMission
) & { type: T };
