import type { Model } from "../../state/model/Model";

export function createEmptyPayload(): Model {
	return {
		expansions: [],

		locations: {
			solar_radiation: {
				id: "solar_radiation",
				maneuvers: [],
				explorable: true,
				hazard: { flavor: "none", effects: [] },
				revealed: false,
			},

			earth: {
				id: "earth",
				maneuvers: [
					{
						destinationID: "suborbital_flight",
						difficulty: 3,
						hazards: {
							location: {
								type: "location",
								locationID: "suborbital_flight",
							},
						},
					},
					{
						destinationID: "earth_orbit",
						difficulty: 8,
						hazards: {
							location: {
								type: "location",
								locationID: "suborbital_flight",
							},
						},
					},
				],
				explorable: false,
				noRendezvousOrRepair: true,
				freeRepairAndHeal: true,
			},
			suborbital_flight: {
				id: "suborbital_flight",
				maneuvers: [
					{
						destinationID: "earth",
						difficulty: null,
						hazards: {
							landing: { type: "landing", optional: true },
						},
					},
					{
						destinationID: "earth_orbit",
						difficulty: 5,
						hazards: {},
					},
				],
				explorable: true,
				noRendezvousOrRepair: true,
				astronautOnly: true,
				hazard: { flavor: "none", effects: [] },
				revealed: false,
			},
			earth_orbit: {
				id: "earth_orbit",
				maneuvers: [
					{
						destinationID: "earth",
						difficulty: 0,
						hazards: {
							re_entry: { type: "re_entry" },
							landing: { type: "landing", optional: true },
						},
					},
					{
						destinationID: "lunar_fly_by",
						difficulty: 1,
						duration: null,
						hazards: {},
					},
					{
						destinationID: "lunar_orbit",
						difficulty: 3,
						duration: null,
						hazards: {},
					},
					{
						destinationID: "inner_transfer",
						difficulty: 3,
						duration: 1,
						hazards: {},
					},
					{
						destinationID: "mars_fly_by",
						difficulty: 3,
						duration: 3,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
					{
						destinationID: "mars_orbit",
						difficulty: 5,
						duration: 3,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
				],
				explorable: false,
			},

			lunar_fly_by: {
				id: "lunar_fly_by",
				maneuvers: [
					{
						destinationID: "earth_orbit",
						difficulty: 1,
						duration: null,
						hazards: {},
					},
					{
						destinationID: "lunar_orbit",
						difficulty: 2,
						duration: null,
						hazards: {},
					},
					{
						destinationID: "moon",
						difficulty: 4,
						hazards: {
							landing: { type: "landing", optional: false },
							location: { type: "location", locationID: "moon" },
						},
					},
					{
						destinationID: "lost",
						difficulty: null,
						hazards: {},
					},
				],
				explorable: false,
			},
			lunar_orbit: {
				id: "lunar_orbit",
				maneuvers: [
					{
						destinationID: "earth_orbit",
						difficulty: 3,
						duration: null,
						hazards: {},
					},
					{
						destinationID: "moon",
						difficulty: 2,
						hazards: {
							location: { type: "location", locationID: "moon" },
							landing: { type: "landing", optional: false },
						},
					},
				],
				explorable: false,
			},
			moon: {
				id: "moon",
				explorable: true,
				maneuvers: [
					{
						destinationID: "lunar_orbit",
						difficulty: 2,
						hazards: {},
					},
				],
				hazard: { flavor: "none", effects: [] },
				revealed: false,
			},

			inner_transfer: {
				id: "inner_transfer",
				maneuvers: [
					{
						destinationID: "earth_orbit",
						difficulty: 3,
						duration: 1,
						hazards: {},
					},
					{
						destinationID: "venus_fly_by",
						difficulty: 2,
						duration: 1,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
					{
						destinationID: "venus_orbit",
						difficulty: 3,
						duration: 1,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
					{
						destinationID: "ceres",
						difficulty: 5,
						duration: 1,
						hazards: {
							radiation: { type: "radiation" },
							landing: { type: "landing", optional: false },
							location: { type: "location", locationID: "ceres" },
						},
					},
					{
						destinationID: "mars_orbit",
						difficulty: 4,
						duration: 2,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
					{
						destinationID: "lost",
						difficulty: null,
						hazards: {},
					},
				],
				explorable: false,
			},

			mars_fly_by: {
				id: "mars_fly_by",
				maneuvers: [
					{
						destinationID: "mars_orbit",
						difficulty: 3,
						duration: null,
						hazards: {},
					},
					{
						destinationID: "mars",
						difficulty: 3,
						hazards: {
							re_entry: { type: "re_entry" },
							landing: { type: "landing", optional: false },
							location: { type: "location", locationID: "ceres" },
						},
					},
					{
						destinationID: "lost",
						difficulty: null,
						hazards: {},
					},
				],
				explorable: false,
			},
			mars_orbit: {
				id: "mars_orbit",
				maneuvers: [
					{
						destinationID: "earth_orbit",
						difficulty: 5,
						duration: 3,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
					{
						destinationID: "inner_transfer",
						difficulty: 4,
						duration: 2,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
					{
						destinationID: "phobos",
						difficulty: 1,
						duration: null,
						hazards: {
							landing: { type: "landing", optional: false },
							location: {
								type: "location",
								locationID: "phobos",
							},
						},
					},
					{
						destinationID: "mars",
						difficulty: 0,
						hazards: {
							re_entry: { type: "re_entry" },
							landing: { type: "landing", optional: false },
							location: { type: "location", locationID: "mars" },
						},
					},
				],
				explorable: false,
			},
			phobos: {
				id: "phobos",
				maneuvers: [
					{
						destinationID: "mars_orbit",
						difficulty: 1,
						duration: null,
						hazards: {},
					},
				],
				explorable: true,
				hazard: { flavor: "none", effects: [] },
				revealed: false,
			},
			mars: {
				id: "mars",
				maneuvers: [
					{
						destinationID: "mars_orbit",
						difficulty: 3,
						hazards: {},
					},
				],
				explorable: true,
				hazard: { flavor: "none", effects: [] },
				revealed: false,
			},

			venus_fly_by: {
				id: "venus_fly_by",
				maneuvers: [
					{
						destinationID: "venus_orbit",
						difficulty: 1,
						duration: null,
						hazards: {},
					},
					{
						destinationID: "venus",
						difficulty: 1,
						hazards: {
							re_entry: { type: "re_entry" },
							landing: { type: "landing", optional: true },
							location: { type: "location", locationID: "venus" },
						},
					},
					{
						destinationID: "lost",
						difficulty: null,
						hazards: {},
					},
				],
				explorable: false,
			},
			venus_orbit: {
				id: "venus_orbit",
				maneuvers: [
					{
						destinationID: "inner_transfer",
						difficulty: 3,
						duration: 1,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
					{
						destinationID: "venus",
						difficulty: 0,
						hazards: {
							re_entry: { type: "re_entry" },
							landing: { type: "landing", optional: true },
							location: { type: "location", locationID: "venus" },
						},
					},
				],
				explorable: false,
			},
			venus: {
				id: "venus",
				maneuvers: [
					{
						destinationID: "venus_orbit",
						difficulty: 6,
						hazards: {},
					},
				],
				explorable: true,
				hazard: { flavor: "none", effects: [] },
				revealed: false,
			},

			ceres: {
				id: "ceres",
				maneuvers: [
					{
						destinationID: "inner_transfer",
						difficulty: 5,
						duration: 2,
						hazards: {
							radiation: { type: "radiation" },
						},
					},
				],
				explorable: true,
				hazard: { flavor: "none", effects: [] },
				revealed: false,
			},
		},

		advancementDefinitions: {
			juno_rockets: {
				id: "juno_rockets",
				startingOutcomes: 3,
			},
			atlas_rockets: {
				id: "atlas_rockets",
				startingOutcomes: 3,
			},
			soyuz_rockets: {
				id: "soyuz_rockets",
				startingOutcomes: 3,
			},
			saturn_rockets: {
				id: "saturn_rockets",
				startingOutcomes: 3,
			},

			ion_thrusters: {
				id: "ion_thrusters",
				startingOutcomes: 3,
			},

			surveying: {
				id: "surveying",
				startingOutcomes: 1,
			},

			rendezvous: {
				id: "rendezvous",
				startingOutcomes: 3,
				speciality: "pilot",
				improveMajorFailures: true,
			},

			re_entry: {
				id: "re_entry",
				startingOutcomes: 3,
			},
			landing: {
				id: "landing",
				startingOutcomes: 3,
				speciality: "pilot",
				improveMajorFailures: true,
			},

			life_support: {
				id: "life_support",
				startingOutcomes: 3,
				speciality: "mechanic",
				improveMajorFailures: false,
			},
		},
		componentDefinitions: {
			juno_rocket: {
				id: "juno_rocket",
				type: "rocket",
				advancementID: "juno_rockets",
				cost: 1,
				mass: 1,
				thrust: 4,
			},
			atlas_rocket: {
				id: "atlas_rocket",
				type: "rocket",
				advancementID: "atlas_rockets",
				cost: 5,
				mass: 4,
				thrust: 27,
			},
			soyuz_rocket: {
				id: "soyuz_rocket",
				type: "rocket",
				advancementID: "soyuz_rockets",
				cost: 8,
				mass: 9,
				thrust: 80,
			},
			saturn_rocket: {
				id: "saturn_rocket",
				type: "rocket",
				advancementID: "saturn_rockets",
				cost: 15,
				mass: 20,
				thrust: 200,
			},

			ion_thruster: {
				id: "ion_thruster",
				type: "ion_thruster",
				advancementID: "ion_thrusters",
				cost: 10,
				mass: 1,
				thrustPerYear: 5,
			},

			probe: {
				id: "probe",
				type: "probe",
				cost: 2,
				mass: 1,
			},

			vostok_capsule: {
				id: "vostok_capsule",
				type: "capsule",
				advancementID: "re_entry",
				cost: 2,
				mass: 2,
				capacity: 1,
				heatShields: true,
			},
			apollo_capsule: {
				id: "apollo_capsule",
				type: "capsule",
				advancementID: "re_entry",
				cost: 4,
				mass: 3,
				capacity: 3,
				heatShields: true,
			},
			eagle_capsule: {
				id: "eagle_capsule",
				type: "capsule",
				advancementID: "landing",
				cost: 4,
				mass: 1,
				capacity: 2,
				heatShields: false,
			},
			aldrin_capsule: {
				id: "aldrin_capsule",
				type: "capsule",
				advancementID: "life_support",
				cost: 4,
				mass: 3,
				capacity: 8,
				heatShields: false,
				radiationProtection: 1,
			},

			supplies: {
				id: "supplies",
				type: "supplies",
				advancementID: "life_support",
				cost: 1,
				mass: 1,
			},

			moon_sample: {
				id: "moon_sample",
				type: "sample",
				mass: 1,
				locationID: "moon",
			},
			phobos_sample: {
				id: "phobos_sample",
				type: "sample",
				mass: 1,
				locationID: "phobos",
			},
			mars_sample: {
				id: "mars_sample",
				type: "sample",
				mass: 1,
				locationID: "mars",
			},
			venus_sample: {
				id: "venus_sample",
				type: "sample",
				mass: 1,
				locationID: "venus",
			},
			ceres_sample: {
				id: "ceres_sample",
				type: "sample",
				mass: 1,
				locationID: "ceres",
			},

			mechanic_astronaut: {
				id: "mechanic_astronaut",
				type: "astronaut",
				cost: 5,
				speciality: "mechanic",
			},
			doctor_astronaut: {
				id: "doctor_astronaut",
				type: "astronaut",
				cost: 5,
				speciality: "doctor",
			},
			pilot_astronaut: {
				id: "pilot_astronaut",
				type: "astronaut",
				cost: 5,
				speciality: "pilot",
			},
		},

		year: 1956,
		endYear: 1976,
		missions: [],
		agencies: [],

		nextID: 0,
		rngState: [0, 0, 0, 0],
	};
}
