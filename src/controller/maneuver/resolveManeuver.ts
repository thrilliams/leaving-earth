import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import { type Decision } from "../../state/decision/Decision";
import type { ManeuverInformation } from "../../state/decision/maneuverInformation/ManeuverInformation";
import { getComponent } from "../../state/helpers/component";
import { getCapsuleDefinitionOfAstronaut } from "../../state/helpers/component/astronaut";
import { getComponentDefinition } from "../../state/helpers/component/definition";
import { getLocation } from "../../state/helpers/location";
import {
	getManeuver,
	modifyManeuverDifficultyAndDuration,
} from "../../state/helpers/maneuver";
import {
	doesSpacecraftExist,
	doesSpacecraftHaveAstronaut,
	getSpacecraft,
	getSpacecraftMass,
} from "../../state/helpers/spacecraft";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { AdvancementID } from "../../state/model/advancement/Advancement";
import type { Outcome } from "../../state/model/advancement/Outcome";
import type { Component } from "../../state/model/component/Component";
import type { RadiationLocationHazardEffect } from "../../state/model/location/locationHazard/LocationHazard";
import type { Model } from "../../state/model/Model";
import { destroyComponent } from "../helpers/component";
import { revealLocation } from "../helpers/location";
import { drawOutcome } from "../helpers/outcome";
import { getD8 } from "../helpers/rng/number";
import { destroySpacecraft, moveSpacecraft } from "../helpers/spacecraft";
import { resolveManeuverHazards } from "./resolveManeuverHazards";
import type { Game } from "../../game";

export function resolveManeuver(
	model: Draft<Model>,
	logger: Logger<Game>,
	{
		agencyID,
		spacecraftID,
		maneuverID,
		durationModifier,
		rocketIDs,
		spentRocketIDs,
		generatedThrust,
		nextHazard,
		astronautsAssigned,
	}: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const spacecraft = getSpacecraft(model, spacecraftID);
	const maneuver = getManeuver(model, maneuverID);

	const { difficulty, duration } = modifyManeuverDifficultyAndDuration(
		maneuver.duration || 0,
		maneuver.difficulty || 0,
		durationModifier
	);

	for (let i = 0; i < rocketIDs.length; i++) {
		const rocketID = rocketIDs[i];
		const component = getComponent(model, rocketID);
		const definition = getComponentDefinition(model, component.type);

		let outcome: Outcome;
		let drawnOutcome: Outcome | null;
		let advancementID: AdvancementID;
		if (definition.type === "rocket") {
			advancementID = definition.advancementID;
			[outcome, drawnOutcome] = drawOutcome(
				model,
				logger,
				agencyID,
				definition.advancementID,
				spacecraftID,
				true
			);

			if (outcome === "success") {
				generatedThrust += definition.thrust;
				spentRocketIDs.push(rocketID);

				logger("before")`${["component", rocketID]} produced ${[
					"number",
					definition.thrust,
				]} thrust and was discarded`;
			} else if (outcome === "minor_failure") {
				component.damaged = true;

				logger("before")`${[
					"component",
					rocketID,
				]} failed to produce thrust and was damaged`;
			} else {
				logger("before")`${[
					"component",
					rocketID,
				]} exploded during maneuver and destroyed ${[
					"spacecraft",
					spacecraftID,
				]}`;

				destroySpacecraft(model, logger, spacecraftID);
			}
		} else if (definition.type === "ion_thruster") {
			advancementID = definition.advancementID;
			[outcome, drawnOutcome] = drawOutcome(
				model,
				logger,
				agencyID,
				definition.advancementID,
				spacecraftID,
				true
			);

			(component as Component<"ion_thruster">).firedThisYear = true;

			if (outcome === "success") {
				generatedThrust += definition.thrustPerYear * duration;

				logger("before")`${["component", rocketID]} produced ${[
					"number",
					definition.thrustPerYear * duration,
				]} thrust and cannot be fired again this year`;
			} else {
				component.damaged = true;

				logger("before")`${[
					"component",
					rocketID,
				]} failed to produce thrust and was damaged`;
			}
		} else {
			throw new Error("unexpected rocket definition type");
		}

		const decision: Decision = {
			type: "continue_maneuver",
			agencyID,
			spacecraftID,
			maneuverID,
			durationModifier,
			rocketIDs: rocketIDs.slice(i + 1),
			spentRocketIDs,
			generatedThrust,
			nextHazard,
			astronautsAssigned: false,
		};

		if (drawnOutcome) {
			const returnValue: ReducerReturnType<Decision, Interrupt> = [
				{
					type: "discard_outcome",
					agencyID,
					outcome,
					advancementID,
					componentID: rocketID,
					spacecraftID,
				},
			];

			if (doesSpacecraftExist(model, spacecraftID)) {
				returnValue.push({
					kind: "decision",
					value: decision,
				});
			}

			return returnValue;
		}

		if (i < rocketIDs.length - 1) return [decision];
	}

	// if insufficient thrust generated, prompt user to give up or try more rockets
	if (generatedThrust < difficulty * getSpacecraftMass(model, spacecraftID)) {
		logger("after")`${[
			"spacecraft",
			spacecraftID,
		]} did not generate enough thrust to complete ${[
			"maneuver",
			maneuverID,
		]}; attempting to fire remaining rockets to compensate`;

		return [
			{
				type: "continue_maneuver",
				agencyID,
				spacecraftID,
				maneuverID,
				durationModifier,
				rocketIDs: [],
				spentRocketIDs,
				generatedThrust,
				nextHazard,
				astronautsAssigned,
			},
		];
	}

	// if sufficient thrust generated, destroy used rockets
	for (const componentID of spentRocketIDs)
		destroyComponent(model, logger, componentID);

	// if destroying used rockets
	if (!doesSpacecraftExist(model, spacecraftID)) return [];

	// before encountering radiation, if astronauts, then assign capsules
	if (
		!astronautsAssigned &&
		doesSpacecraftHaveAstronaut(model, spacecraftID) &&
		maneuver.hazards["radiation"]
	)
		return [
			{
				type: "assign_astronauts",
				agencyID: agencyID,
				spacecraftID: spacecraftID,
			},
			{
				kind: "decision",
				value: {
					type: "continue_maneuver",
					agencyID,
					maneuverID,
					spacecraftID,
					durationModifier,
					rocketIDs: [],
					spentRocketIDs,
					generatedThrust,
					nextHazard: "radiation",
					astronautsAssigned: true,
				},
			},
		];

	// if radiation has already been encountered, also skip adding years
	if (
		nextHazard !== "re_entry" &&
		nextHazard !== "landing" &&
		nextHazard !== "location"
	) {
		// place year tokens on spacecraft
		spacecraft.years += duration;

		// face radiation
		if (maneuver.hazards["radiation"]) {
			const location = getLocation(model, "solar_radiation");
			if (!location.explorable)
				throw new Error("solar_radiation must be explorable");

			if (!location.revealed)
				revealLocation(model, logger, "solar_radiation", agencyID);

			const radiationEffect = location.hazard?.effects.find(
				({ type }) => type === "radiation"
			) as RadiationLocationHazardEffect | undefined;
			if (radiationEffect === undefined)
				throw new Error("expected radiation hazard effect");

			for (const componentID of spacecraft.componentIDs) {
				const component = getComponent(model, componentID);
				const definition = getComponentDefinition(
					model,
					component.type
				);
				if (definition.type !== "astronaut") continue;

				const radiationProtection =
					getCapsuleDefinitionOfAstronaut(model, componentID, true)
						?.radiationProtection || 0;

				const radiationRoll = getD8(model);

				// radiation protection subtracted from severity
				const effectiveMinimum =
					Math.max(
						0,
						radiationEffect.severity - radiationProtection
					) * spacecraft.years;

				if (radiationRoll <= effectiveMinimum) {
					const component = getComponent(model, componentID);
					component.damaged = true;

					logger("after")`${["component", componentID]} rolled a ${[
						"number",
						radiationRoll,
					]} against an effective minimum of ${[
						"number",
						radiationRoll,
					]} and was incapacitated by radiation`;
				} else {
					logger("after")`${["component", componentID]} rolled a ${[
						"number",
						radiationRoll,
					]} against an effective minimum of ${[
						"number",
						radiationRoll,
					]} and was not affected by radiation`;
				}
			}

			// after using assignments for radiation, unset astronauts for
			// next relevant hazard (probably reentry)
			astronautsAssigned = false;
		}

		nextHazard = "re_entry";
	}

	// if in multi-year maneuver, stop now
	if (spacecraft.years > 0) {
		spacecraft.maneuverID = maneuverID;
		if (maneuver.destinationID === "lost")
			throw new Error("multi-year maneuver to lost not supported");

		logger("before")`${["spacecraft", spacecraftID]} will complete ${[
			"maneuver",
			maneuverID,
		]} in ${["number", spacecraft.years]} ${[
			"string",
			spacecraft.years !== 1 ? "years" : "year",
		]}`;

		moveSpacecraft(
			model,
			logger,
			spacecraftID,
			maneuver.destinationID,
			false
		);

		return [];
	}

	// otherwise, face remaining hazards
	const [decision, ...next] = resolveManeuverHazards(model, logger, {
		agencyID,
		spacecraftID,
		maneuverID,
		durationModifier,
		rocketIDs: [],
		spentRocketIDs,
		generatedThrust,
		nextHazard,
		astronautsAssigned,
	});

	// if maneuver hazards raised decisions, resolve those
	if (decision) return [decision, ...next];

	// then finish maneuver
	if (maneuver.destinationID !== "lost") {
		logger("before")`${["spacecraft", spacecraftID]} completed ${[
			"maneuver",
			maneuverID,
		]}`;

		// move spacecraft
		moveSpacecraft(
			model,
			logger,
			spacecraftID,
			maneuver.destinationID,
			true
		);
	} else {
		// if going to lost, explode
		destroySpacecraft(model, logger, spacecraftID);

		logger("before")`${[
			"spacecraft",
			spacecraftID,
		]} moved to lost and was destroyed`;
	}

	return [];
}
