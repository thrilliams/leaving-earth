import type { Draft, Logger, Next, ReducerReturnType } from "laika-engine";
import type { Game } from "../../game";
import { type Decision } from "../../state/decision/Decision";
import type { ManeuverInformation } from "../../state/decision/maneuverInformation/ManeuverInformation";
import { getComponent, isComponentOfType } from "../../state/helpers/component";
import { getComponentDefinition } from "../../state/helpers/component/definition";
import { getLocation } from "../../state/helpers/location";
import { getManeuver } from "../../state/helpers/maneuver";
import {
	doesSpacecraftHaveAstronaut,
	getSpacecraft,
} from "../../state/helpers/spacecraft";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type {
	SicknessLocationHazardEffect,
	SpacecraftDestroyedLocationHazardEffect,
} from "../../state/model/location/locationHazard/LocationHazard";
import type { Model } from "../../state/model/Model";
import { revealLocation } from "../helpers/location";
import { completeLocationMissions } from "../helpers/mission";
import { getD8 } from "../helpers/rng/number";
import { destroySpacecraft } from "../helpers/spacecraft";
import { encounterLanding } from "./encounterLanding";
import { encounterReEntry } from "./encounterReEntry";

export function resolveManeuverHazards(
	model: Draft<Model>,
	logger: Logger<Game>,
	{
		agencyID,
		spacecraftID,
		maneuverID,
		durationModifier,
		generatedThrust,
		nextHazard,
		astronautsAssigned,
	}: ManeuverInformation,
	completeMissions = false
): ReducerReturnType<Decision, Interrupt> {
	const spacecraft = getSpacecraft(model, spacecraftID);
	const maneuver = getManeuver(model, maneuverID);

	const continueManeuverDecision: Decision = {
		type: "continue_maneuver",
		agencyID: agencyID,
		maneuverID: maneuverID,
		spacecraftID: spacecraftID,
		durationModifier,
		rocketIDs: [],
		spentRocketIDs: [],
		generatedThrust,
		nextHazard,
		astronautsAssigned: true,
	};

	if (
		maneuver.hazards.re_entry &&
		nextHazard !== "landing" &&
		nextHazard !== "location"
	) {
		if (
			!astronautsAssigned &&
			doesSpacecraftHaveAstronaut(model, spacecraftID)
		)
			return [
				{
					type: "assign_astronauts",
					agencyID: agencyID,
					spacecraftID: spacecraftID,
				},
				{
					kind: "decision",
					value: continueManeuverDecision,
				},
			];

		const capsuleIDs = spacecraft.componentIDs.filter((componentID) => {
			const component = getComponent(model, componentID);
			const definition = getComponentDefinition(model, component.type);
			return definition.type === "capsule";
		});

		const [decision, ...next] = encounterReEntry(
			model,
			logger,
			agencyID,
			spacecraftID,
			capsuleIDs
		);

		// if encounterReEntry presented another decision to the player, halt
		// execution. otherwise, continue encountering hazards
		if (decision) {
			continueManeuverDecision.nextHazard = "landing";
			return [
				decision,
				...next,
				{
					kind: "decision",
					value: continueManeuverDecision,
				},
			];
		}
	}

	if (maneuver.hazards.landing && nextHazard !== "location") {
		let decision: Decision | undefined = undefined;
		let next: Next<Decision, Interrupt>[] = [];

		if (maneuver.hazards.landing.optional) {
			decision = {
				type: "encounter_landing",
				agencyID,
				spacecraftID,
			};
		} else {
			[decision, ...next] = encounterLanding(
				model,
				logger,
				agencyID,
				spacecraftID
			);
		}

		if (decision) {
			continueManeuverDecision.nextHazard = "location";
			return [
				decision,
				...next,
				{
					kind: "decision",
					value: continueManeuverDecision,
				},
			];
		}

		nextHazard = "location";
	}

	if (maneuver.hazards.location && nextHazard === "location") {
		const locationID = maneuver.hazards.location.locationID;
		const location = getLocation(model, locationID);
		if (!location.explorable)
			throw new Error("maneuver location hazard must be explorable!");

		if (!location.revealed) {
			// if i.e. suborbital flight and spacecraft has astronauts,
			// optionally hide information from other players
			if (location.astronautOnly) {
				if (doesSpacecraftHaveAstronaut(model, spacecraftID))
					return [
						{
							type: "reveal_location",
							agencyID,
							spacecraftID,
							locationID,
							locationHazard: location.hazard,
						},
						{
							kind: "decision",
							value: continueManeuverDecision,
						},
					];
			} else {
				// non-astronaut-only locations reveal unconditionally
				revealLocation(model, logger, locationID, agencyID);
			}
		}

		// the only two location hazards that do anything are
		// SpacecraftDestroyed and Sickness; everything else doesn't interact
		// directly with spacecraft performing maneuvers
		const sicknessEffect = location.hazard?.effects.find(
			({ type }) => type === "sickness"
		) as SicknessLocationHazardEffect | undefined;

		if (sicknessEffect) {
			// roll for each astronaut
			for (const componentID of spacecraft.componentIDs) {
				const component = getComponent(model, componentID);
				if (!isComponentOfType(model, component, "astronaut")) continue;

				const sicknessRoll = getD8(model);

				// if roll is below severity,
				if (sicknessRoll <= sicknessEffect.severity) {
					// incapacitate astronaut
					const component = getComponent(model, componentID);
					component.damaged = true;

					logger("before")`${["component", componentID]} rolled a ${[
						"number",
						sicknessRoll,
					]} against a minimum of ${[
						"number",
						sicknessEffect.severity,
					]} and was incapacitated by sickness`;
				} else {
					logger("before")`${["component", componentID]} rolled a ${[
						"number",
						sicknessRoll,
					]} against a minimum of ${[
						"number",
						sicknessEffect.severity,
					]} and was not affected by sickness`;
				}
			}
		}

		const spacecraftDestroyedEffect = location.hazard?.effects.find(
			({ type }) => type === "spacecraft_destroyed"
		) as SpacecraftDestroyedLocationHazardEffect | undefined;

		if (spacecraftDestroyedEffect) {
			logger("before")`${[
				"spacecraft",
				spacecraftID,
			]} was destroyed by a hazard of ${["location", locationID]}`;

			// destroy spacecraft *smiles*
			destroySpacecraft(model, logger, spacecraftID);
		}
	}

	if (completeMissions) completeLocationMissions(model, logger, spacecraftID);

	return [];
}
