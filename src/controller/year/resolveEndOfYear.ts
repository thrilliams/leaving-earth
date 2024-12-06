import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../game";
import type { Decision } from "../../state/decision/Decision";
import { isAgencyUnbeatable } from "../../state/helpers/agency";
import { getAllComponents } from "../../state/helpers/component";
import { getLocation } from "../../state/helpers/location";
import {
	getAllSpacecraftIDs,
	getSpacecraft,
	getSpacecraftOfComponent,
	getSpacecraftOwner,
	isComponentOnSpacecraft,
} from "../../state/helpers/spacecraft";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { EndOfYearStep } from "../../state/interrupt/interruptTypes/EndOfYearInterrupt";
import type { Model } from "../../state/model/Model";
import type { SpacecraftID } from "../../state/model/Spacecraft";
import { resolveManeuverHazards } from "../maneuver/resolveManeuverHazards";
import { resolveLifeSupport } from "./resolveLifeSupport";
import { resolveStartOfYear } from "./resolveStartOfYear";

export const resolveEndOfYear = (
	model: Draft<Model>,
	logger: Logger<Game>,
	step: EndOfYearStep = "repair_and_heal",
	remainingSpacecraftIDs?: SpacecraftID[]
): ReducerReturnType<Decision, Interrupt> => {
	// 1. On Earth, repair all damaged components and heal all incapacitated
	// astronauts by turning them face up.
	if (
		step !== "life_support" &&
		step !== "increment_year" &&
		step !== "multi_year_maneuvers"
	) {
		for (const component of getAllComponents(model)) {
			if (
				!isComponentOnSpacecraft(model, component.id) &&
				component.damaged
			) {
				component.damaged = false;
				logger("after")`${[
					"component",
					component.id,
				]} was repaired for free`;
				continue;
			}

			if (!isComponentOnSpacecraft(model, component.id)) continue;

			const spacecraft = getSpacecraftOfComponent(model, component.id);
			const location = getLocation(model, spacecraft.locationID);
			if (location.freeRepairAndHeal && component.damaged) {
				component.damaged = false;
				logger("after")`${[
					"component",
					component.id,
				]} was repaired for free`;
			}
		}
	}

	// 2. Check to see if astronauts off Earth survive.
	if (step !== "increment_year" && step !== "multi_year_maneuvers") {
		if (remainingSpacecraftIDs === undefined)
			remainingSpacecraftIDs = getAllSpacecraftIDs(model);

		for (let i = 0; i < remainingSpacecraftIDs.length; i++) {
			const spacecraftID = remainingSpacecraftIDs[i];
			const owner = getSpacecraftOwner(model, spacecraftID);
			const [decision, ...next] = resolveLifeSupport(
				model,
				logger,
				owner.id,
				spacecraftID
			);

			if (decision) {
				return [
					decision,
					...next,
					{
						kind: "interrupt",
						value: {
							type: "end_of_year",
							step: "increment_year",
							remainingSpacecraftIDs:
								remainingSpacecraftIDs.slice(i),
						},
					},
				];
			}
		}

		remainingSpacecraftIDs = undefined;
	}

	// 3. Move the calendar marker to the next year. If the next year is off the
	// end of the calendar, the game ends at this time.
	if (step !== "multi_year_maneuvers") {
		model.year++;

		let shouldEnd = false;

		if (model.year > model.endYear) {
			shouldEnd = true;

			logger("after")`the last year of gameplay has been completed`;
		}

		if (model.agencies.length > 1) {
			for (const agency of model.agencies) {
				if (isAgencyUnbeatable(model, agency.id)) {
					shouldEnd = true;

					logger("after")`${[
						"agency",
						agency.id,
					]} has enough victory points to be unbeatable`;

					break;
				}
			}
		}

		if (shouldEnd)
			return [
				{
					type: "none",
					agencyID: -1,
				},
			];

		step = "multi_year_maneuvers";
	}

	// 4. Remove one time token from each spacecraft that has any. When the last
	// time token is removed from a spacecraft, it may face hazards upon arrival
	// (such as landing on Ceres) and it may complete missions.
	if (step === "multi_year_maneuvers") {
		if (remainingSpacecraftIDs === undefined)
			remainingSpacecraftIDs = getAllSpacecraftIDs(model);

		for (let i = 0; i < remainingSpacecraftIDs.length; i++) {
			const spacecraftID = remainingSpacecraftIDs[i];
			const spacecraft = getSpacecraft(model, spacecraftID);

			if (spacecraft.years === 0) continue;
			if (spacecraft.maneuverID === undefined)
				throw new Error("expected spacecraft to have maneuver ID");

			spacecraft.years--;
			if (spacecraft.years !== 0) {
				logger("after")`${[
					"spacecraft",
					spacecraftID,
				]} will complete ${["maneuver", spacecraft.maneuverID]} in ${[
					"number",
					spacecraft.years,
				]}`;
				continue;
			} else {
				logger("after")`the last year counter has been removed from ${[
					"spacecraft",
					spacecraftID,
				]}; it will now encounter hazards for ${[
					"maneuver",
					spacecraft.maneuverID,
				]}`;
			}

			const owner = getSpacecraftOwner(model, spacecraftID);
			const [decision, ...next] = resolveManeuverHazards(
				model,
				logger,
				{
					agencyID: owner.id,
					spacecraftID,
					maneuverID: spacecraft.maneuverID,
					durationModifier: 0,
					rocketIDs: [],
					spentRocketIDs: [],
					generatedThrust: 0,
					nextHazard: "radiation",
					astronautsAssigned: false,
				},
				true
			);

			if (decision) {
				return [
					decision,
					...next,
					{
						kind: "interrupt",
						value: {
							type: "end_of_year",
							step: "multi_year_maneuvers",
							remainingSpacecraftIDs:
								remainingSpacecraftIDs.slice(i),
						},
					},
				];
			}

			// check for completing missions here
		}

		return resolveStartOfYear(model, logger);
	}

	throw new Error("unexpected end of year step");
};
