import type { MissionSetup } from "../../helpers";
import type { LocationID, Mission, Model } from "../../model";
import { getRandomElements } from "../helpers/rng/array";
import { endOfTurnToLost } from "./endOfYearToLost";

export function addOuterPlanetsContent(
	model: Model,
	missionSetup: MissionSetup
) {
	// update base game locations
	const marsFlyBy = model.locations.mars_fly_by;

	marsFlyBy?.maneuvers
		.find(({ destinationID }) => destinationID === "mars_orbit")!
		.profiles.push({
			difficulty: 1,
			hazards: [{ type: "aerobraking" }],
		});

	marsFlyBy?.maneuvers.push({
		destinationID: "jupiter_fly_by",
		profiles: [
			{
				difficulty: 4,
				hazards: [
					{ type: "location", locationID: "solar_radiation" },
					{ type: "duration", years: 3 },
				],
				slingshot: "jupiter",
			},
		],
	});

	const venusFlyBy = model.locations.venus_fly_by;

	venusFlyBy?.maneuvers
		.find(({ destinationID }) => destinationID === "venus_orbit")!
		.profiles.push({
			difficulty: 0,
			hazards: [{ type: "aerobraking" }],
		});

	venusFlyBy?.maneuvers.push({
		destinationID: "jupiter_fly_by",
		profiles: [
			{
				difficulty: 1,
				hazards: [
					{ type: "location", locationID: "solar_radiation" },
					{ type: "duration", years: 1 },
				],
				slingshot: "jupiter",
			},
		],
	});

	// add new locations
	model.locations.outer_transfer = {
		id: "outer_transfer",
		maneuvers: [
			{
				destinationID: "ceres",
				profiles: [
					{
						difficulty: 3,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 1 },
							{ type: "landing", optional: false },
							{ type: "location", locationID: "ceres" },
						],
					},
				],
			},
			{
				destinationID: "earth_orbit",
				profiles: [
					{
						difficulty: 6,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 1 },
						],
					},
					{
						difficulty: 1,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 1 },
							{ type: "aerobraking" },
						],
					},
				],
			},
			{
				destinationID: "uranus_fly_by",
				profiles: [
					{
						difficulty: 4,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 9 },
						],
						slingshot: "uranus",
					},
				],
			},
			{
				destinationID: "saturn_fly_by",
				profiles: [
					{
						difficulty: 3,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 3 },
						],
						slingshot: "saturn",
					},
				],
			},
			{
				destinationID: "jupiter_fly_by",
				profiles: [
					{
						difficulty: 4,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 2 },
						],
						slingshot: "jupiter",
					},
				],
			},
			{
				destinationID: "mars_orbit",
				profiles: [
					{
						difficulty: 5,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 1 },
						],
					},
					{
						difficulty: 2,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 1 },
							{ type: "aerobraking" },
						],
					},
				],
			},
			endOfTurnToLost(),
		],
		explorable: false,
	};

	model.locations.jupiter_fly_by = {
		id: "jupiter_fly_by",
		maneuvers: [
			{
				destinationID: "outer_transfer",
				profiles: [
					{
						difficulty: 4,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 2 },
						],
					},
				],
			},
			{
				destinationID: "saturn_fly_by",
				profiles: [
					{
						difficulty: 0,
						hazards: [
							{ type: "location", locationID: "jupiter" },
							{ type: "duration", years: 2 },
							{ type: "location", locationID: "solar_radiation" },
						],
						slingshot: "saturn",
					},
				],
			},
			{
				destinationID: "jupiter_orbit",
				profiles: [
					{
						difficulty: 10,
						hazards: [
							{ type: "location", locationID: "jupiter" },
							{ type: "duration", years: 0 },
						],
					},
					{
						difficulty: 3,
						hazards: [
							{ type: "location", locationID: "jupiter" },
							{ type: "aerobraking" },
						],
					},
				],
			},
			{
				destinationID: "lost",
				profiles: [
					{
						difficulty: null,
						hazards: [{ type: "location", locationID: "jupiter" }],
					},
				],
			},
		],
		explorable: false,
		surveyableLocations: ["io", "europa", "ganymede", "callisto"],
	};

	model.locations.jupiter_orbit = {
		id: "jupiter_orbit",
		maneuvers: [
			{
				destinationID: "jupiter_fly_by",
				profiles: [
					{
						difficulty: 10,
						hazards: [
							{ type: "location", locationID: "jupiter" },
							{ type: "duration", years: 0 },
						],
					},
				],
			},
			{
				destinationID: "io",
				profiles: [
					{
						difficulty: 2,
						hazards: [
							{ type: "location", locationID: "jupiter" },
							{ type: "duration", years: 0 },
							{ type: "landing", optional: false },
							{ type: "location", locationID: "io" },
						],
					},
				],
			},
			{
				destinationID: "europa",
				profiles: [
					{
						difficulty: 2,
						hazards: [
							{ type: "location", locationID: "jupiter" },
							{ type: "duration", years: 0 },
							{ type: "landing", optional: false },
							{ type: "location", locationID: "europa" },
						],
					},
				],
			},
			{
				destinationID: "ganymede_orbit",
				profiles: [
					{
						difficulty: 3,
						hazards: [
							{ type: "location", locationID: "jupiter" },
							{ type: "duration", years: 0 },
						],
					},
				],
			},
			{
				destinationID: "callisto",
				profiles: [
					{
						difficulty: 5,
						hazards: [
							{ type: "duration", years: 0 },
							{ type: "landing", optional: false },
							{ type: "location", locationID: "callisto" },
						],
					},
				],
			},
		],
		explorable: false,
		surveyableLocations: ["ganymede"],
		endOfYearHazards: "jupiter",
	};

	model.locations.io = {
		id: "io",
		maneuvers: [
			{
				destinationID: "jupiter_orbit",
				profiles: [
					{
						difficulty: 2,
						hazards: [{ type: "duration", years: 0 }],
					},
				],
			},
		],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,

		endOfYearHazards: "jupiter",
	};

	model.locations.europa = {
		id: "europa",
		maneuvers: [
			{
				destinationID: "jupiter_orbit",
				profiles: [
					{
						difficulty: 2,
						hazards: [{ type: "duration", years: 0 }],
					},
				],
			},
		],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,

		endOfYearHazards: "jupiter",
	};

	model.locations.ganymede_orbit = {
		id: "ganymede_orbit",
		maneuvers: [
			{
				destinationID: "jupiter_orbit",
				profiles: [
					{
						difficulty: 3,
						hazards: [{ type: "duration", years: 0 }],
					},
				],
			},
			{
				destinationID: "ganymede",
				profiles: [
					{
						difficulty: 2,
						hazards: [
							{ type: "landing", optional: false },
							{ type: "location", locationID: "ganymede" },
						],
					},
				],
			},
		],
		explorable: false,
	};

	model.locations.ganymede = {
		id: "ganymede",
		maneuvers: [
			{
				destinationID: "ganymede_orbit",
				profiles: [{ difficulty: 2, hazards: [] }],
			},
		],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	model.locations.callisto = {
		id: "callisto",
		maneuvers: [
			{
				destinationID: "jupiter_orbit",
				profiles: [
					{
						difficulty: 5,
						hazards: [{ type: "duration", years: 0 }],
					},
				],
			},
			{
				destinationID: "jupiter_fly_by",
				profiles: [
					{
						difficulty: 5,
						hazards: [{ type: "location", locationID: "jupiter" }],
					},
				],
			},
		],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	model.locations.jupiter = {
		id: "jupiter",
		maneuvers: [],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	model.locations.saturn_fly_by = {
		id: "saturn_fly_by",
		maneuvers: [
			{
				destinationID: "saturn_orbit",
				profiles: [
					{
						difficulty: 7,
						hazards: [
							{ type: "location", locationID: "saturn" },
							{ type: "duration", years: 0 },
						],
					},
					{
						difficulty: 1,
						hazards: [
							{ type: "location", locationID: "saturn" },
							{ type: "aerobraking" },
						],
					},
				],
			},
			{
				destinationID: "uranus_fly_by",
				profiles: [
					{
						difficulty: 0,
						hazards: [
							{ type: "location", locationID: "saturn" },
							{ type: "duration", years: 5 },
							{ type: "location", locationID: "solar_radiation" },
						],
					},
				],
			},
			{
				destinationID: "outer_transfer",
				profiles: [
					{
						difficulty: 3,
						hazards: [
							{ type: "duration", years: 3 },
							{ type: "location", locationID: "solar_radiation" },
						],
					},
				],
			},
			{
				destinationID: "lost",
				profiles: [
					{
						difficulty: null,
						hazards: [{ type: "location", locationID: "saturn" }],
					},
				],
			},
		],
		explorable: false,
		surveyableLocations: ["enceladus", "titan"],
	};

	model.locations.saturn_orbit = {
		id: "saturn_orbit",
		maneuvers: [
			{
				destinationID: "saturn_fly_by",
				profiles: [
					{
						difficulty: 7,
						hazards: [
							{ type: "location", locationID: "saturn" },
							{ type: "duration", years: 0 },
						],
					},
				],
			},
			{
				destinationID: "titan_orbit",
				profiles: [
					{
						difficulty: 2,
						hazards: [{ type: "duration", years: 0 }],
					},
					{
						difficulty: 1,
						hazards: [{ type: "aerobraking" }],
					},
				],
			},
			{
				destinationID: "titan",
				profiles: [
					{
						difficulty: 1,
						hazards: [
							{ type: "re_entry" },
							{ type: "location", locationID: "titan" },
						],
					},
				],
			},
			{
				destinationID: "enceladus",
				profiles: [
					{
						difficulty: 2,
						hazards: [
							{ type: "duration", years: 0 },
							{ type: "landing", optional: false },
							{ type: "location", locationID: "enceladus" },
						],
					},
				],
			},
		],
		explorable: false,
		endOfYearHazards: "saturn",
	};

	model.locations.enceladus = {
		id: "enceladus",
		maneuvers: [
			{
				destinationID: "saturn_orbit",
				profiles: [
					{
						difficulty: 2,
						hazards: [{ type: "duration", years: 0 }],
					},
				],
			},
		],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	model.locations.titan_orbit = {
		id: "titan_orbit",
		maneuvers: [
			{
				destinationID: "saturn_orbit",
				profiles: [
					{
						difficulty: 2,
						hazards: [{ type: "duration", years: 0 }],
					},
				],
			},
			{
				destinationID: "titan",
				profiles: [
					{
						difficulty: 0,
						hazards: [
							{ type: "landing", optional: true },
							{ type: "location", locationID: "titan" },
						],
					},
				],
			},
		],
		explorable: false,
	};

	model.locations.titan = {
		id: "titan",
		maneuvers: [
			{
				destinationID: "titan",
				profiles: [{ difficulty: 2, hazards: [] }],
			},
		],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	model.locations.saturn = {
		id: "saturn",
		maneuvers: [],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	model.locations.uranus_fly_by = {
		id: "uranus_fly_by",
		maneuvers: [
			{
				destinationID: "neptune_fly_by",
				profiles: [
					{
						difficulty: 0,
						hazards: [
							{ type: "location", locationID: "uranus" },
							{ type: "duration", years: 4 },
							{ type: "location", locationID: "solar_radiation" },
						],
						slingshot: "neptune",
					},
				],
			},
			{
				destinationID: "outer_transfer",
				profiles: [
					{
						difficulty: 9,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
						],
					},
				],
			},
			{
				destinationID: "lost",
				profiles: [
					{
						difficulty: null,
						hazards: [{ type: "location", locationID: "uranus" }],
					},
				],
			},
		],
		explorable: false,
	};

	model.locations.uranus = {
		id: "uranus",
		maneuvers: [],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	model.locations.neptune_fly_by = {
		id: "neptune_fly_by",
		maneuvers: [
			{
				destinationID: "lost",
				profiles: [
					{
						difficulty: null,
						hazards: [{ type: "location", locationID: "neptune" }],
					},
				],
			},
		],
		explorable: false,
	};

	model.locations.neptune = {
		id: "neptune",
		maneuvers: [],

		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	// add outer planets advancements
	model.advancementDefinitions.aerobraking = {
		id: "aerobraking",
		startingOutcomes: 3,
		prerequisite: "re_entry",
	};

	model.advancementDefinitions.proton_rockets = {
		id: "proton_rockets",
		startingOutcomes: 3,
		prerequisite: "soyuz_rockets",
	};

	// add outer planets components
	model.componentDefinitions.proton_rocket = {
		id: "proton_rocket",
		type: "rocket",
		advancementID: "proton_rockets",
		cost: 12,
		mass: 6,
		thrust: 70,
	};

	model.componentDefinitions.explorer_payload = {
		id: "explorer_payload",
		type: "explorer",
		advancementID: "rendezvous",
		cost: 3,
		mass: 1,
	};
	model.componentDefinitions.galileo_probe = {
		id: "galileo_probe",
		type: "probe",
		advancementID: "surveying",
		cost: 5,
		mass: 2,
		radiationShielding: 1,
	};

	model.componentDefinitions.ganymede_sample = {
		id: "ganymede_sample",
		type: "sample",
		mass: 1,
		locationID: "ganymede",
	};
	model.componentDefinitions.io_sample = {
		id: "io_sample",
		type: "sample",
		mass: 1,
		locationID: "io",
	};
	model.componentDefinitions.callisto_sample = {
		id: "callisto_sample",
		type: "sample",
		mass: 1,
		locationID: "callisto",
	};
	model.componentDefinitions.europa_sample = {
		id: "europa_sample",
		type: "sample",
		mass: 1,
		locationID: "europa",
	};
	model.componentDefinitions.enceladus_sample = {
		id: "enceladus_sample",
		type: "sample",
		mass: 1,
		locationID: "enceladus",
	};
	model.componentDefinitions.saturn_sample = {
		id: "saturn_sample",
		type: "sample",
		mass: 1,
		// ring samples
		locationID: "saturn_orbit",
	};

	model.componentDefinitions.scientist_astronaut = {
		id: "scientist_astronaut",
		type: "astronaut",
		cost: 5,
		speciality: "scientist",
	};

	// set end year and add maneuver windows
	model.endYear = 1986;

	model.maneuverWindows.jupiter = {
		firstYear: 1956,
		interval: 2,
	};

	model.maneuverWindows.saturn = {
		firstYear: 1957,
		interval: 3,
	};

	model.maneuverWindows.jupiter = {
		firstYear: 1957,
		interval: 5,
	};

	model.maneuverWindows.jupiter = {
		firstYear: 1958,
		interval: 6,
	};

	// add non-explorable missions
	const nonExplorableMissions: Mission[] = [
		{
			id: "io_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 4,
			locationID: "io",
		},
		{
			id: "europa_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 4,
			locationID: "europa",
		},
		{
			id: "ganymede_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 3,
			locationID: "ganymede",
		},
		{
			id: "callisto_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 3,
			locationID: "callisto",
		},
		{
			id: "jupiter_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 5,
			locationID: "jupiter",
		},
		{
			id: "jupiter_system_survey",
			difficulty: "non_explorable",
			type: "reveal_multiple_locations",
			points: 5,
			locationIDs: ["io", "europa", "ganymede", "callisto", "jupiter"],
		},
		{
			id: "enceladus_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 3,
			locationID: "enceladus",
		},
		{
			id: "titan_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 6,
			locationID: "titan",
		},
		{
			id: "saturn_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 6,
			locationID: "saturn",
		},
		{
			id: "uranus_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 9,
			locationID: "uranus",
		},
		{
			id: "neptune_survey",
			difficulty: "non_explorable",
			type: "reveal_location",
			points: 10,
			locationID: "neptune",
		},
		{
			id: "grand_tour",
			difficulty: "non_explorable",
			type: "reveal_multiple_locations",
			points: 10,
			locationIDs: ["jupiter", "saturn", "uranus", "neptune"],
		},
	];

	if (missionSetup === "all") {
		model.missions.push(...nonExplorableMissions);
	} else {
		const drawnNonExplorableMissions = getRandomElements(
			model,
			nonExplorableMissions.filter(({ points }) =>
				missionSetup.outerPlanetsPointCap !== undefined
					? points <= missionSetup.outerPlanetsPointCap
					: true
			),
			missionSetup.non_explorable
		);

		model.missions.push(...drawnNonExplorableMissions);
	}

	// add explorable missions
	const explorableMissions: Partial<Record<LocationID, Mission[]>> = {
		io: [
			{
				id: "advanced_io_survey",
				difficulty: "explorable",
				type: "galileo_survey",
				points: 7,
				locationID: "io",
				letters: ["alpha"],
			},
			{
				id: "io_lander",
				difficulty: "explorable",
				type: "lander",
				points: 12,
				locationID: "io",
				letters: ["alpha"],
			},
			{
				id: "io_sample_return",
				difficulty: "explorable",
				type: "sample_return",
				points: 20,
				locationID: "io",
				letters: ["alpha"],
			},
		],
		europa: [
			{
				id: "advanced_europa_survey",
				difficulty: "explorable",
				type: "galileo_survey",
				points: 8,
				locationID: "europa",
				letters: ["alpha", "gamma"],
			},
			{
				id: "europa_lander",
				difficulty: "explorable",
				type: "lander",
				points: 14,
				locationID: "europa",
				letters: ["alpha", "beta"],
			},
			{
				id: "europa_ice_explorer",
				difficulty: "explorable",
				type: "discard_explorer",
				points: 16,
				locationID: "europa",
				letters: ["beta"],
			},
			{
				id: "europa_sample_return",
				difficulty: "explorable",
				type: "sample_return",
				points: 24,
				locationID: "europa",
				letters: ["beta"],
			},
		],
		ganymede: [
			{
				id: "ganymede_lander",
				difficulty: "explorable",
				type: "lander",
				points: 16,
				locationID: "ganymede",
				letters: ["alpha"],
			},
			{
				id: "ganymede_sample_return",
				difficulty: "explorable",
				type: "sample_return",
				points: 24,
				locationID: "ganymede",
				letters: ["alpha"],
			},
		],
		callisto: [
			{
				id: "callisto_lander",
				difficulty: "explorable",
				type: "lander",
				points: 15,
				locationID: "callisto",
				letters: ["alpha"],
			},
		],
		jupiter: [
			{
				id: "jupiter_orbiter",
				difficulty: "explorable",
				type: "lander",
				points: 9,
				locationID: "jupiter_orbit",
				letters: ["alpha", "beta"],
			},
			{
				id: "manned_jupiter_fly_by",
				difficulty: "explorable",
				type: "manned_mission",
				points: 25,
				locationID: "jupiter_fly_by",
				letters: ["beta"],
			},
			{
				id: "jupiter_station",
				difficulty: "explorable",
				type: "station_multiple_locations",
				points: 25,
				locationIDs: [
					"io",
					"europa",
					"ganymede_orbit",
					"ganymede",
					"callisto",
					"jupiter_orbit",
					// this should never happen but better safe than sorry
					"jupiter",
				],
				letters: ["beta"],
			},
		],
		enceladus: [
			{
				id: "advanced_enceladus_survey",
				difficulty: "explorable",
				type: "galileo_survey",
				points: 8,
				locationID: "enceladus",
				letters: ["alpha", "beta"],
			},
			{
				id: "enceladus_lander",
				difficulty: "explorable",
				type: "lander",
				points: 12,
				locationID: "enceladus",
				letters: ["beta"],
			},
			{
				id: "enceladus_ice_explorer",
				difficulty: "explorable",
				type: "discard_explorer",
				points: 16,
				locationID: "enceladus",
				letters: ["beta"],
			},
			{
				id: "enceladus_sample_return",
				difficulty: "explorable",
				type: "sample_return",
				points: 20,
				locationID: "enceladus",
				letters: ["alpha", "beta"],
			},
		],
		titan: [
			{
				id: "advanced_titan_survey",
				difficulty: "explorable",
				type: "galileo_survey",
				points: 10,
				locationID: "titan",
				letters: ["alpha", "beta"],
			},
			{
				id: "titan_lander",
				difficulty: "explorable",
				type: "lander",
				points: 17,
				locationID: "titan",
				letters: ["beta"],
			},
			{
				id: "titan_cloud_explorer",
				difficulty: "explorable",
				type: "discard_explorer",
				points: 22,
				locationID: "titan",
				letters: ["alpha"],
			},
			{
				id: "titan_sample_return",
				difficulty: "explorable",
				type: "sample_return",
				points: 26,
				locationID: "titan",
				letters: ["alpha", "beta"],
			},
			{
				id: "man_on_titan",
				difficulty: "explorable",
				type: "manned_mission",
				points: 42,
				locationID: "titan",
				letters: ["alpha", "beta"],
			},
		],
		saturn: [
			{
				id: "saturn_orbiter",
				difficulty: "explorable",
				type: "lander",
				points: 13,
				locationID: "saturn_orbit",
				letters: ["alpha"],
			},
			{
				id: "saturn_ring_sample_return",
				difficulty: "explorable",
				type: "sample_return",
				points: 25,
				locationID: "saturn_orbit",
				letters: ["alpha"],
			},
			{
				id: "saturn_station",
				difficulty: "explorable",
				type: "station_multiple_locations",
				points: 30,
				locationIDs: [
					"enceladus",
					"titan_orbit",
					"titan",
					"saturn_orbit",
					// as above
					"saturn",
				],
				letters: ["beta"],
			},
			{
				id: "manned_saturn_fly_by",
				difficulty: "explorable",
				type: "manned_mission",
				points: 35,
				locationID: "saturn_fly_by",
				letters: ["beta"],
			},
		],
	};

	if (missionSetup !== "all") {
		for (const location in explorableMissions) {
			explorableMissions[location as LocationID] = explorableMissions[
				location as LocationID
			]?.filter(({ points }) =>
				missionSetup.outerPlanetsPointCap !== undefined
					? points <= missionSetup.outerPlanetsPointCap
					: true
			);
		}
	}

	model.explorableMissions = explorableMissions;
}
