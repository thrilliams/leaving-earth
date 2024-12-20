import type { ExpansionID } from "../../expansion/ExpansionID";
import type { Mission } from "./Mission";

export function getPossibleMissions(expansions: ExpansionID[]) {
	const possibleMissions: Record<"easy" | "medium" | "hard", Mission[]> = {
		easy: [
			{
				id: "sounding_rocket",
				difficulty: "easy",
				type: "lander",
				points: 1,
				locationID: null,
			},
			{
				id: "artifical_satellite",
				difficulty: "easy",
				type: "lander",
				points: 2,
				locationID: "earth_orbit",
			},
			{
				id: "man_in_space",
				difficulty: "easy",
				type: "manned_mission",
				points: 2,
				locationID: null,
			},
			{
				id: "man_in_orbit",
				difficulty: "easy",
				type: "manned_mission",
				points: 4,
				locationID: "earth_orbit",
			},
			{
				id: "lunar_survey",
				difficulty: "easy",
				type: "reveal_location",
				points: 4,
				locationID: "moon",
			},
			{
				id: "mars_survey",
				difficulty: "easy",
				type: "reveal_location",
				points: 5,
				locationID: "mars",
			},
		],
		medium: [
			{
				id: "lunar_lander",
				difficulty: "medium",
				type: "lander",
				points: 6,
				locationID: "moon",
			},
			{
				id: "mars_lander",
				difficulty: "medium",
				type: "lander",
				points: 7,
				locationID: "mars",
			},
			{
				id: "venus_lander",
				difficulty: "medium",
				type: "lander",
				points: 11,
				locationID: "venus",
			},
			{
				id: "ceres_lander",
				difficulty: "medium",
				type: "lander",
				points: 8,
				locationID: "ceres",
			},
			{
				id: "man_on_the_moon",
				difficulty: "medium",
				type: "manned_mission",
				points: 12,
				locationID: "moon",
			},
			{
				id: "venus_survey",
				difficulty: "medium",
				type: "reveal_location",
				points: 6,
				locationID: "venus",
			},
			{
				id: "space_station",
				difficulty: "medium",
				type: "station",
				points: 6,
				locationID: null,
			},
			{
				id: "lunar_sample_return",
				difficulty: "medium",
				type: "sample_return",
				points: 10,
				locationID: "moon",
			},
			{
				id: "phobos_sample_return",
				difficulty: "medium",
				type: "sample_return",
				points: 12,
				locationID: "phobos",
			},
		],
		hard: [
			{
				id: "man_on_mars",
				difficulty: "hard",
				type: "manned_mission",
				points: 24,
				locationID: "mars",
			},
			{
				id: "man_on_venus",
				difficulty: "hard",
				type: "manned_mission",
				points: 32,
				locationID: "venus",
			},
			{
				id: "lunar_station",
				difficulty: "hard",
				type: "station",
				points: 15,
				locationID: "moon",
			},
			{
				id: "mars_station",
				difficulty: "hard",
				type: "station",
				points: 20,
				locationID: "mars",
			},
			{
				id: "venus_station",
				difficulty: "hard",
				type: "station",
				points: 27,
				locationID: "venus",
			},
			{
				id: "mars_sample_return",
				difficulty: "hard",
				type: "sample_return",
				points: 16,
				locationID: "mars",
			},
			{
				id: "venus_sample_return",
				difficulty: "hard",
				type: "sample_return",
				points: 24,
				locationID: "venus",
			},
			{
				id: "ceres_sample_return",
				difficulty: "hard",
				type: "sample_return",
				points: 14,
				locationID: "ceres",
			},
			{
				id: "extraterrestrial_life",
				difficulty: "hard",
				type: "extraterrestrial_life",
				points: 40,
			},
		],
	};

	if (expansions.includes("mercury")) {
		possibleMissions.medium.push(
			{
				id: "mercury_survey",
				difficulty: "medium",
				type: "reveal_location",
				points: 7,
				locationID: "mercury",
			},
			{
				id: "mercury_lander",
				difficulty: "medium",
				type: "lander",
				points: 13,
				locationID: "mercury",
			}
		);

		possibleMissions.hard.push({
			id: "mercury_sample_return",
			difficulty: "hard",
			type: "sample_return",
			points: 19,
			locationID: "mercury",
		});
	}

	return possibleMissions;
}
