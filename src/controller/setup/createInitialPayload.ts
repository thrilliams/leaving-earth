import { getNextID } from "../helpers/id";
import { getRandomElement, getRandomElements } from "../helpers/rng/array";
import { seedRandomNumberGenerator } from "../helpers/rng/number";
import { resolveStartOfYear } from "../year/resolveStartOfYear";
import { PossibleLocationHazards } from "../../state/model/location/locationHazard/PossibleLocationHazards";
import { PossibleMissions } from "../../state/model/mission/PossibleMissions";
import {
	normalSetup,
	type MissionSetup,
} from "../../state/model/mission/MissionSetup";
import { createEmptyPayload } from "./createEmptyPayload";

export type InitializationOptions = Partial<{
	rngSeed: number;
	players: number;
	missionSetup: MissionSetup;
}>;

export function createInitialPayload({
	rngSeed,
	players = 1,
	missionSetup = normalSetup,
}: InitializationOptions) {
	const model = createEmptyPayload();

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
	const [decision, ...next] = resolveStartOfYear(model, null);

	return { model, decision, next, log: [] };
}
