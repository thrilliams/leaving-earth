import { AgencyID } from "@state/model/Agency";
import type { SpacecraftID } from "@state/model/Spacecraft";
import { selector, predicate } from "./wrappers";
import type { ComponentID } from "@state/model/component/Component";
import { getAvailableMissions, isMissionImpossible } from "./mission";

export const doesAgencyExist = predicate((model, agencyID: AgencyID) => {
	const agency = model.agencies.find(({ id }) => id === agencyID);
	return agency !== undefined;
});

/**
 * gets an agency from an agencyID, or errors if none exists
 */
export const getAgency = selector((model, agencyID: AgencyID) => {
	const agency = model.agencies.find(({ id }) => id === agencyID);
	if (agency !== undefined) return agency;
	throw new Error("agency ID could not be resolved");
});

/**
 * returns true if the specified agency owns the selected spacecraft, or false otherwise. does not check for spacecraft existence.
 */
export const doesAgencyOwnSpacecraft = predicate(
	(model, agencyID: AgencyID, spacecraftID: SpacecraftID) => {
		const agency = getAgency(model, agencyID);
		for (const spacecraft of agency.spacecraft) {
			if (spacecraft.id === spacecraftID) return true;
		}

		return false;
	}
);

/**
 * returns true if the specified agency owns the selected component, or false otherwise. does not check for component existence.
 */
export const doesAgencyOwnComponent = predicate(
	(model, agencyID: AgencyID, componentID: ComponentID) => {
		const agency = getAgency(model, agencyID);
		for (const component of agency.components) {
			if (component.id === componentID) return true;
		}

		return false;
	}
);

export const getAgencyScore = predicate(
	(model, agencyID: AgencyID, includingAstronauts: boolean) => {
		const agency = getAgency(model, agencyID);
		let score = 0;

		for (const mission of agency.missions) score += mission.points;

		if (includingAstronauts) score -= 2 * agency.deadAstronauts.length;

		return score;
	}
);

export const isAgencyUnbeatable = predicate((model, agencyID: AgencyID) => {
	const finalScore = getAgencyScore(model, agencyID, true);

	let nextHighestScore = -Infinity;
	for (const agency of model.agencies) {
		if (agency.id === agencyID) continue;
		const agencyScore = getAgencyScore(model, agency.id, true);
		if (agencyScore > nextHighestScore) nextHighestScore = agencyScore;
	}

	let totalAvailableScore = 0;
	for (const mission of getAvailableMissions(model)) {
		if (isMissionImpossible(model, mission.id)) {
			console.warn("impossible mission not yet pruned");
			continue;
		}

		totalAvailableScore += mission.points;
	}

	return finalScore > nextHighestScore + totalAvailableScore;
});
