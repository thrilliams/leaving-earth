import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../game";
import { type Decision } from "../../state/decision/Decision";
import type { ManeuverInformation } from "../../state/decision/maneuverInformation/ManeuverInformation";
import { getComponent } from "../../state/helpers/component";
import { getComponentDefinition } from "../../state/helpers/component/definition";
import {
	getManeuver,
	getManeuverDuration,
	modifyManeuverDifficultyAndDuration,
} from "../../state/helpers/maneuver";
import {
	doesSpacecraftExist,
	getSpacecraftMass,
} from "../../state/helpers/spacecraft";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { AdvancementID } from "../../state/model/advancement/Advancement";
import type { Outcome } from "../../state/model/advancement/Outcome";
import type { Component } from "../../state/model/component/Component";
import type { Model } from "../../state/model/Model";
import { destroyComponent } from "../helpers/component";
import { drawOutcome } from "../helpers/outcome";
import { destroySpacecraft } from "../helpers/spacecraft";
import { resolveManeuverHazards } from "./resolveManeuverHazards";

export function resolveManeuver(
	model: Draft<Model>,
	logger: Logger<Game>,
	{
		agencyID,
		spacecraftID,
		maneuverID,
		profileIndex,
		durationModifier,
		rocketIDs,
		spentRocketIDs,
		generatedThrust,
		nextHazardIndex,
	}: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const maneuver = getManeuver(model, maneuverID);
	const profile = maneuver.profiles[profileIndex];
	const profileDuration = getManeuverDuration(
		model,
		maneuverID,
		profileIndex
	);

	const { difficulty, duration } = modifyManeuverDifficultyAndDuration(
		profileDuration || 0,
		profile.difficulty || 0,
		durationModifier
	);

	for (let i = 0; i < rocketIDs.length; i++) {
		const componentID = rocketIDs[i];
		const component = getComponent(model, componentID);
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
				spentRocketIDs.push(componentID);

				logger("before")`${["component", componentID]} produced ${[
					"number",
					definition.thrust,
				]} thrust and was discarded`;
			} else if (outcome === "minor_failure") {
				component.damaged = true;

				logger("before")`${[
					"component",
					componentID,
				]} failed to produce thrust and was damaged`;
			} else {
				logger("before")`${[
					"component",
					componentID,
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

				logger("before")`${["component", componentID]} produced ${[
					"number",
					definition.thrustPerYear * duration,
				]} thrust and cannot be fired again this year`;
			} else {
				component.damaged = true;

				logger("before")`${[
					"component",
					componentID,
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
			profileIndex,
			durationModifier,
			rocketIDs: rocketIDs.slice(i + 1),
			spentRocketIDs,
			generatedThrust,
			nextHazardIndex,
		};

		if (drawnOutcome) {
			const returnValue: ReducerReturnType<Decision, Interrupt> = [
				{
					type: "discard_outcome",
					agencyID,
					outcome,
					advancementID,
					componentID,
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
			profileIndex,
		]}; attempting to fire remaining rockets to compensate`;

		return [
			{
				type: "continue_maneuver",
				agencyID,
				spacecraftID,
				maneuverID,
				profileIndex,
				durationModifier,
				rocketIDs: [],
				spentRocketIDs,
				generatedThrust,
				nextHazardIndex,
			},
		];
	}

	// if sufficient thrust generated, destroy used rockets
	for (const componentID of spentRocketIDs)
		destroyComponent(model, logger, componentID);

	// face remaining hazards
	return resolveManeuverHazards(model, logger, {
		agencyID,
		spacecraftID,
		maneuverID,
		profileIndex,
		durationModifier,
		rocketIDs: [],
		spentRocketIDs: [],
		generatedThrust,
		nextHazardIndex,
	});
}
