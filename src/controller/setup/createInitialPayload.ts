import { getNextID } from "../helpers/id";
import { getRandomElement, getRandomElements } from "../helpers/rng/array";
import { seedRandomNumberGenerator } from "../helpers/rng/number";
import { resolveStartOfYear } from "../year/resolveStartOfYear";
import { PossibleLocationHazards } from "../../state/model/location/locationHazard/PossibleLocationHazards";
import {
	normalSetup,
	type MissionSetup,
} from "../../state/model/mission/MissionSetup";
import { createEmptyPayload } from "./createEmptyPayload";
import type { ExpansionID } from "../../state/expansion/ExpansionID";
import { getPossibleMissions } from "../../state/model/mission/PossibleMissions";

export type InitializationOptions = Partial<{
	rngSeed: number;
	players: number;
	missionSetup: MissionSetup;
	expansions: ExpansionID[];
}>;

export function createInitialPayload({
	rngSeed,
	players = 1,
	missionSetup = normalSetup,
	expansions = [],
}: InitializationOptions) {
	const model = createEmptyPayload();

	seedRandomNumberGenerator(model, rngSeed);

	// ensure uniqueness of expansions
	model.expansions = Array.from(new Set(expansions));

	// add expansion content
	if (model.expansions.includes("mercury")) {
		model.locations.mercury_fly_by = {
			id: "mercury_fly_by",
			maneuvers: [
				{
					destinationID: "mercury_orbit",
					difficulty: 2,
					duration: null,
					hazards: {},
				},
				{
					destinationID: "mercury",
					difficulty: 4,
					hazards: {
						landing: { type: "landing", optional: false },
						location: { type: "location", locationID: "mercury" },
					},
				},
				{
					destinationID: "lost",
					difficulty: null,
					hazards: {},
				},
			],
			explorable: false,
		};

		model.locations.mercury_orbit = {
			id: "mercury_orbit",
			maneuvers: [
				{
					destinationID: "inner_transfer",
					difficulty: 7,
					duration: 1,
					hazards: {
						radiation: { type: "radiation" },
					},
				},
				{
					destinationID: "mercury",
					difficulty: 2,
					hazards: {
						landing: { type: "landing", optional: false },
						location: { type: "location", locationID: "mercury" },
					},
				},
			],
			explorable: false,
		};

		model.locations.mercury = {
			id: "mercury",
			maneuvers: [
				{
					destinationID: "mercury_orbit",
					difficulty: 2,
					hazards: {},
				},
			],
			explorable: true,
			hazard: { flavor: "none", effects: [] },
			revealed: false,
		};

		model.locations.inner_transfer!.maneuvers.push({
			destinationID: "mercury_fly_by",
			difficulty: 5,
			duration: 1,
			hazards: {
				radiation: { type: "radiation" },
			},
		});

		model.componentDefinitions.mercury_sample = {
			id: "mercury_sample",
			type: "sample",
			mass: 1,
			locationID: "mercury",
		};
	}

	// draw missions
	const possibleMissions = getPossibleMissions(model.expansions);

	if (missionSetup === "all") {
		model.missions.push(
			...possibleMissions["easy"],
			...possibleMissions["medium"],
			...possibleMissions["hard"]
		);
	} else {
		const easyMissions = getRandomElements(
			model,
			possibleMissions["easy"],
			missionSetup["easy"]
		);

		const mediumMissions = getRandomElements(
			model,
			possibleMissions["medium"],
			missionSetup["medium"]
		);

		const hardMissions = getRandomElements(
			model,
			possibleMissions["hard"],
			missionSetup["hard"]
		);

		model.missions.push(
			...easyMissions,
			...mediumMissions,
			...hardMissions
		);
	}

	// draw locations
	for (const key in PossibleLocationHazards) {
		const locationID = key as keyof typeof PossibleLocationHazards;

		const location = model.locations[locationID];
		if (!location) continue;

		if (!location.explorable)
			throw new Error("expected location to be explorable");

		location.hazard = getRandomElement(
			model,
			PossibleLocationHazards[locationID]
		);
	}

	// add agencies
	for (let i = 0; i < players; i++) {
		model.agencies.push({
			id: getNextID(model),

			funds: 0,
			components: [],
			advancements: {},
			spacecraft: [],

			missions: [],
			deadAstronauts: [],

			passedThisYear: false,
		});
	}

	// pick starting player, give money
	const [decision, ...next] = resolveStartOfYear(model, null);

	return { model, decision, next, log: [] };
}
