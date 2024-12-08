import type { MissionDifficulty } from "./Mission";

export type MissionSetup =
	| (Record<Exclude<MissionDifficulty, "explorable">, number> & {
			outerPlanetsPointCap?: number;
	  })
	| "all";

export const easySetup: MissionSetup = {
	easy: 5,
	medium: 0,
	hard: 0,
	non_explorable: 3,
	outerPlanetsPointCap: 6,
};

export const normalSetup: MissionSetup = {
	easy: 4,
	medium: 2,
	hard: 0,
	non_explorable: 4,
	outerPlanetsPointCap: 13,
};

export const hardSetup: MissionSetup = {
	easy: 3,
	medium: 3,
	hard: 2,
	non_explorable: 5,
	outerPlanetsPointCap: 24,
};

export const veryHardSetup: MissionSetup = {
	easy: 1,
	medium: 4,
	hard: 4,
	non_explorable: 6,
};
