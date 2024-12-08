import type { ExpansionID } from "../../state/expansion/ExpansionID";
import { PossibleLocationHazards } from "../../state/model/location/locationHazard/PossibleLocationHazards";
import {
	normalSetup,
	type MissionSetup,
} from "../../state/model/mission/MissionSetup";
import { getPossibleMissions } from "../../state/model/mission/PossibleMissions";
import { getNextID } from "../helpers/id";
import { getRandomElement, getRandomElements } from "../helpers/rng/array";
import { seedRandomNumberGenerator } from "../helpers/rng/number";
import { resolveStartOfYear } from "../year/resolveStartOfYear";
import { addMercuryContent } from "./addMercuryContent";
import { addOuterPlanetsContent } from "./addOuterPlanetsContent";
import { createEmptyPayload } from "./createEmptyPayload";

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
	// ensure expansion uniqueness
	const model = createEmptyPayload(Array.from(new Set(expansions)));

	seedRandomNumberGenerator(model, rngSeed);

	// add expansion content
	if (expansions.includes("mercury")) addMercuryContent(model);
	if (expansions.includes("outer_planets"))
		addOuterPlanetsContent(model, missionSetup);

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

		const drawnHazard = getRandomElement(
			model,
			PossibleLocationHazards[locationID]
		);
		if (!drawnHazard) throw new Error("no possible location hazards found");

		location.hazard = drawnHazard;
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
