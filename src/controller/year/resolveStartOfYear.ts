import { completeMission } from "../helpers/mission";
import { getRandomNumber } from "../helpers/rng/number";
import type { Decision } from "../../state/decision/Decision";
import { getAgency, getAgencyScore } from "../../state/helpers/agency";
import { getAllComponents, getComponentOwner } from "../../state/helpers/component";
import { getSampleEffectOfType } from "../../state/helpers/component/sample";
import { getAvailableMissions } from "../../state/helpers/mission";
import {
	doesSpacecraftHaveAstronaut,
	isComponentOnEarth,
} from "../../state/helpers/spacecraft";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { StartOfYearStep } from "../../state/interrupt/interruptTypes/StartOfYearInterrupt";
import type { AgencyID } from "../../state/model/Agency";
import type { ComponentID } from "../../state/model/component/Component";
import type { Model } from "../../state/model/Model";
import type { Draft } from "laika-engine";
import type { Next } from "laika-engine/src/Next";

const getAgencyIDWithLowestScore = (
	model: Draft<Model>,
	agencyIDs: AgencyID[]
): AgencyID => {
	let lowestScore = 0;
	let lowestScoreIndices: AgencyID[] = [];

	for (let i = 0; i < agencyIDs.length; i++) {
		const agency = getAgency(model, agencyIDs[i]);
		const agencyScore = getAgencyScore(model, agency.id, false);
		if (agencyScore < lowestScore) {
			lowestScore = agencyScore;
			lowestScoreIndices = [i];
		} else if (agencyScore === lowestScore) {
			lowestScoreIndices.push(i);
		}
	}

	let chosenIndex = lowestScoreIndices[0];
	if (lowestScoreIndices.length > 1) {
		const randomIndex = getRandomNumber(model, lowestScoreIndices.length);
		chosenIndex = lowestScoreIndices[randomIndex];
	}

	return agencyIDs[chosenIndex];
};

// also used for tied start-of-year missions
const getStartingAgencyID = (model: Draft<Model>): AgencyID => {
	const allAgencyIDs = model.agencies.map(({ id }) => id);
	return getAgencyIDWithLowestScore(model, allAgencyIDs);
};

export const resolveStartOfYear = (
	model: Draft<Model>,
	step: StartOfYearStep = "give_funding",
	remainingComponentIDs?: ComponentID[]
): [Decision, ...Next<Decision, Interrupt>[]] => {
	if (
		step !== "turn_in_valuable_samples" &&
		step !== "turn_in_alien_samples" &&
		step !== "complete_missions" &&
		step !== "determine_turn_order"
	) {
		for (const agency of model.agencies) agency.funds = 25;
	}

	if (
		step !== "turn_in_alien_samples" &&
		step !== "complete_missions" &&
		step !== "determine_turn_order"
	) {
		if (remainingComponentIDs === undefined) {
			remainingComponentIDs = [];

			for (const component of getAllComponents(model)) {
				if (!isComponentOnEarth(model, component.id)) continue;

				const valuableEffect = getSampleEffectOfType(
					model,
					component.id,
					"valuable_sample"
				);

				if (valuableEffect === undefined) continue;

				remainingComponentIDs.push(component.id);
			}
		}

		for (let i = 0; i < remainingComponentIDs.length; i++) {
			const owner = getComponentOwner(model, remainingComponentIDs[i]);
			return [
				{
					type: "turn_in_valuable_sample",
					agencyID: owner.id,
					sampleID: remainingComponentIDs[i],
				},
				{
					kind: "interrupt",
					value: {
						type: "start_of_year",
						step: "turn_in_valuable_samples",
						remainingComponentIDs: remainingComponentIDs.slice(i),
					},
				},
			];
		}

		remainingComponentIDs = undefined;
	}

	if (step !== "complete_missions" && step !== "determine_turn_order") {
		if (remainingComponentIDs === undefined) {
			remainingComponentIDs = [];

			for (const component of getAllComponents(model)) {
				if (!isComponentOnEarth(model, component.id)) continue;

				const alienEffect = getSampleEffectOfType(
					model,
					component.id,
					"alien_sample"
				);

				if (alienEffect === undefined) continue;

				remainingComponentIDs.push(component.id);
			}
		}

		for (let i = 0; i < remainingComponentIDs.length; i++) {
			const owner = getComponentOwner(model, remainingComponentIDs[i]);
			return [
				{
					type: "turn_in_alien_sample",
					agencyID: owner.id,
					sampleID: remainingComponentIDs[i],
				},
				{
					kind: "interrupt",
					value: {
						type: "start_of_year",
						step: "turn_in_alien_samples",
						remainingComponentIDs: remainingComponentIDs.slice(i),
					},
				},
			];
		}

		remainingComponentIDs = undefined;
	}

	if (step !== "determine_turn_order") {
		for (const mission of getAvailableMissions(model)) {
			if (mission.type !== "station") continue;

			const qualifyingAgencyIDs: AgencyID[] = [];
			for (const agency of model.agencies) {
				for (const spacecraft of agency.spacecraft) {
					if (spacecraft.locationID !== mission.locationID) continue;
					if (
						!doesSpacecraftHaveAstronaut(model, spacecraft.id, true)
					)
						continue;
					if (!qualifyingAgencyIDs.includes(agency.id))
						qualifyingAgencyIDs.push(agency.id);
				}
			}

			if (qualifyingAgencyIDs.length === 0) continue;

			const recepientAgencyID = getAgencyIDWithLowestScore(
				model,
				qualifyingAgencyIDs
			);

			completeMission(model, recepientAgencyID, mission.id);
		}

		step = "determine_turn_order";
	}

	if (step === "determine_turn_order") {
		const startingAgencyID = getStartingAgencyID(model);
		return [
			{
				type: "take_action",
				agencyID: startingAgencyID,
				firstOfTurn: true,
			},
		];
	}

	throw new Error("unexpected start of year step value");
};
