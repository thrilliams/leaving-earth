import { getNextID } from "@controller/helpers/id";
import {
	getRandomElement,
	getRandomElements,
} from "@controller/helpers/rng/array";
import { seedRandomNumberGenerator } from "@controller/helpers/rng/number";
import { resolveStartOfYear } from "@controller/year/resolveStartOfYear";
import { PossibleLocationHazards } from "@state/model/location/locationHazard/PossibleLocationHazards";
import { PossibleMissions } from "@state/model/mission/PossibleMissions";
import {
	normalSetup,
	type MissionSetup,
} from "@state/model/mission/MissionSetup";
import { createEmptyModel } from "./createEmptyModel";

export type InitializationOptions = Partial<{
	rngSeed: number;
	players: number;
	missionSetup: MissionSetup;
}>;

export function createInitialModel({
	rngSeed,
	players = 1,
	missionSetup = normalSetup,
}: InitializationOptions) {
	const model = createEmptyModel();

	seedRandomNumberGenerator(model, rngSeed);

	// draw missions
	if (missionSetup === "all") {
		model.missions.push(
			...PossibleMissions["easy"],
			...PossibleMissions["medium"],
			...PossibleMissions["hard"]
		);
	} else {
		const easyMissions = getRandomElements(
			model,
			PossibleMissions["easy"],
			missionSetup["easy"]
		);

		const mediumMissions = getRandomElements(
			model,
			PossibleMissions["medium"],
			missionSetup["medium"]
		);

		const hardMissions = getRandomElements(
			model,
			PossibleMissions["hard"],
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
	const [decision, ...next] = resolveStartOfYear(model);

	return { model, decision, next };
}
