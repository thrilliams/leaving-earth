import type { MissionDifficulty } from "./Mission";

export type MissionSetup = Record<MissionDifficulty, number> | "all";

export const easySetup: MissionSetup = {
	easy: 5,
	medium: 0,
	hard: 0,
};

export const normalSetup: MissionSetup = {
	easy: 4,
	medium: 2,
	hard: 0,
};

export const hardSetup: MissionSetup = {
	easy: 3,
	medium: 3,
	hard: 2,
};

export const veryHardSetup: MissionSetup = {
	easy: 1,
	medium: 4,
	hard: 4,
};
