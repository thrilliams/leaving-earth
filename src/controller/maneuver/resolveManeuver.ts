import { drawOutcome } from "@controller/helpers/outcome";
import { getD8 } from "@controller/helpers/rng/number";
import {
	destroySpacecraft,
	moveSpacecraft,
} from "@controller/helpers/spacecraft";
import { type Decision } from "@state/decision/Decision";
import type { ManeuverInformation } from "@state/decision/maneuverInformation/ManeuverInformation";
import { modifyManeuverDifficultyAndDuration } from "@state/decision/maneuverInformation/validateManeuverInformation";
import { getComponent } from "@state/helpers/component";
import { getCapsuleDefinitionOfAstronaut } from "@state/helpers/component/astronaut";
import { getComponentDefinition } from "@state/helpers/component/definition";
import { getLocation } from "@state/helpers/location";
import { getManeuver } from "@state/helpers/maneuver";
import {
	doesSpacecraftExist,
	doesSpacecraftHaveAstronaut,
	getSpacecraft,
	getSpacecraftMass,
} from "@state/helpers/spacecraft";
import type { Interrupt } from "@state/interrupt/Interrupt";
import type { AdvancementID } from "@state/model/advancement/Advancement";
import type { Outcome } from "@state/model/advancement/Outcome";
import type { Component } from "@state/model/component/Component";
import type { RadiationLocationHazardEffect } from "@state/model/location/locationHazard/LocationHazard";
import type { Model } from "@state/model/Model";
import type { Draft, ReducerReturnType } from "laika-engine";
import { resolveManeuverHazards } from "./resolveManeuverHazards";
import { revealLocation } from "@controller/helpers/location";
import { destroyComponent } from "@controller/helpers/component";

// TODO: rockets should not be discarded during resolution; that must happen at the end
export function resolveManeuver(
	model: Draft<Model>,
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
				agencyID,
				definition.advancementID,
				spacecraftID,
				true
			);

			if (outcome === "success") {
				generatedThrust += definition.thrust;
				spentRocketIDs.push(rocketID);
			} else if (outcome === "minor_failure") {
				component.damaged = true;
			} else {
				spentRocketIDs.push(rocketID);
			}

			if (!doesSpacecraftExist(model, spacecraftID)) return [];
		} else if (definition.type === "ion_thruster") {
			advancementID = definition.advancementID;
			[outcome, drawnOutcome] = drawOutcome(
				model,
				agencyID,
				definition.advancementID,
				spacecraftID,
				true
			);

			(component as Component<"ion_thruster">).firedThisYear = true;

			if (outcome === "success") {
				generatedThrust += definition.thrustPerYear * duration;
			} else {
				component.damaged = true;
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
			return [
				{
					type: "discard_outcome",
					agencyID,
					outcome,
					advancementID,
					componentID: rocketID,
					spacecraftID,
				},
				{
					kind: "decision",
					value: decision,
				},
			];
		}

		if (i < rocketIDs.length - 1) return [decision];
	}

	// if insufficient thrust generated, prompt user to give up or try more rockets
	if (generatedThrust < difficulty * getSpacecraftMass(model, spacecraftID))
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

	// if sufficient thrust generated, destroy used rockets
	for (const componentID of spentRocketIDs)
		destroyComponent(model, componentID);

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
				revealLocation(model, "solar_radiation", agencyID);

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

				if (
					getD8(model) <=
					// radiation protection subtracted from severity
					(radiationEffect.severity - radiationProtection) *
						spacecraft.years
				) {
					const component = getComponent(model, componentID);
					component.damaged = true;
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
		moveSpacecraft(model, spacecraftID, maneuver.destinationID, false);
		return [];
	}

	// otherwise, face remaining hazards
	const next = resolveManeuverHazards(model, {
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
	if (next) return next;

	// then finish maneuver
	if (maneuver.destinationID !== "lost") {
		// move spacecraft
		moveSpacecraft(model, spacecraftID, maneuver.destinationID, true);
	} else {
		// if going to lost, explode
		destroySpacecraft(model, spacecraftID);
	}

	return [];
}
