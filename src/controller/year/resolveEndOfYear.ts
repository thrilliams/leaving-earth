import { resolveManeuverHazards } from "@controller/maneuver/resolveManeuverHazards";
import type { Decision } from "@state/decision/Decision";
import { isAgencyUnbeatable } from "@state/helpers/agency";
import { getAllComponents } from "@state/helpers/component";
import { isComponentOnSpacecraft } from "@state/helpers/spacecraft";
import { getLocation } from "@state/helpers/location";
import {
	getAllSpacecraftIDs,
	getSpacecraft,
	getSpacecraftOfComponent,
	getSpacecraftOwner,
} from "@state/helpers/spacecraft";
import type { Interrupt } from "@state/interrupt/Interrupt";
import type { EndOfYearStep } from "@state/interrupt/interruptTypes/EndOfYearInterrupt";
import type { Model } from "@state/model/Model";
import type { SpacecraftID } from "@state/model/Spacecraft";
import type { Draft, ReducerReturnType } from "laika-engine";
import { resolveLifeSupport } from "./resolveLifeSupport";
import { resolveStartOfYear } from "./resolveStartOfYear";

export const resolveEndOfYear = (
	model: Draft<Model>,
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
			if (!isComponentOnSpacecraft(model, component.id)) {
				component.damaged = false;
				continue;
			}

			const spacecraft = getSpacecraftOfComponent(model, component.id);
			const location = getLocation(model, spacecraft.locationID);
			if (location.freeRepairAndHeal) component.damaged = false;
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
				owner.id,
				spacecraftID
			);

			if (decision !== undefined) {
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

		let shouldEnd = model.year > model.endYear;
		for (const agency of model.agencies) {
			if (isAgencyUnbeatable(model, agency.id)) shouldEnd = true;
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

			spacecraft.years--;
			if (spacecraft.years === 0) continue;

			if (spacecraft.maneuverID === undefined)
				throw new Error("expected spacecraft to have maneuver ID");

			const owner = getSpacecraftOwner(model, spacecraftID);
			const [decision, ...next] = resolveManeuverHazards(
				model,
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

			if (decision !== undefined) {
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

		return resolveStartOfYear(model);
	}

	throw new Error("unexpected end of year step");
};
