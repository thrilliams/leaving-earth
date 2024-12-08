import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../../game";
import type {
	AgencyID,
	Decision,
	Interrupt,
	LocationID,
	Model,
	SpacecraftID,
} from "../../../model";
import {
	getComponent,
	getComponentDefinition,
	getLocation,
	getSpacecraft,
	isComponentOfType,
} from "../../../helpers";
import { destroySpacecraft } from "../../helpers/spacecraft";
import { getD8 } from "../../helpers/rng/number";
import { encounterSolarRadiation } from "./encounterSolarRadiation";

function resolveLocationEffectByType(
	model: Draft<Model>,
	logger: Logger<Game>,
	agencyID: AgencyID,
	spacecraftID: SpacecraftID,
	locationID: LocationID,
	years: number,
	effectIndex: number
): ReducerReturnType<Decision, Interrupt> {
	const location = getLocation(model, locationID);
	if (!location.explorable) throw new Error("location must be explorable!");
	const effect = location.hazard.effects[effectIndex];

	const spacecraft = getSpacecraft(model, spacecraftID);

	if (effect.type === "spacecraft_destroyed") {
		destroySpacecraft(model, logger, spacecraftID);
		return [];
	}

	if (effect.type === "sickness") {
		// roll for each astronaut
		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			if (!isComponentOfType(model, component, "astronaut")) continue;

			const sicknessRoll = getD8(model);

			// if roll is below severity,
			if (sicknessRoll <= effect.severity) {
				// incapacitate astronaut
				const component = getComponent(model, componentID);
				component.damaged = true;

				logger("before")`${["component", componentID]} rolled a ${[
					"number",
					sicknessRoll,
				]} against a minimum of ${[
					"number",
					effect.severity,
				]} and was incapacitated by sickness`;
			} else {
				logger("before")`${["component", componentID]} rolled a ${[
					"number",
					sicknessRoll,
				]} against a minimum of ${[
					"number",
					effect.severity,
				]} and was not affected by sickness`;
			}
		}
	}

	if (effect.type === "solar_radiation") {
		return encounterSolarRadiation(
			model,
			logger,
			agencyID,
			spacecraftID,
			effect.severity,
			years,
			false
		);
	}

	if (effect.type === "astronaut_radiation") {
		return encounterSolarRadiation(
			model,
			logger,
			agencyID,
			spacecraftID,
			effect.severity,
			1,
			false
		);
	}

	if (effect.type === "component_radiation") {
		// roll for each astronaut
		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			if (component.damaged) continue;

			const definition = getComponentDefinition(model, component.type);
			if (definition.type !== "probe" && definition.type !== "capsule")
				continue;

			const radiationShielding = definition.radiationShielding || 0;
			const effectiveSeverity = effect.severity - radiationShielding;

			if (effectiveSeverity <= 0) continue;

			const damageRoll = getD8(model);

			// if roll is below severity,
			if (damageRoll <= effectiveSeverity) {
				// damage component
				const component = getComponent(model, componentID);
				component.damaged = true;

				logger("before")`${["agency", agencyID]} rolled a ${[
					"number",
					damageRoll,
				]} for ${["component", componentID]} against a minimum of ${[
					"number",
					effect.severity,
				]} and it was damaged by radiation`;
			} else {
				logger("before")`${["agency", agencyID]} rolled a ${[
					"number",
					damageRoll,
				]} for ${["component", componentID]} against a minimum of ${[
					"number",
					effect.severity,
				]} and it was not affected by radiation`;
			}
		}
	}

	if (effect.type === "damage_component") {
		const damageRoll = getD8(model);
		if (damageRoll <= effect.severity) {
			logger("before")`${["agency", agencyID]} rolled a ${[
				"number",
				damageRoll,
			]} and must now damage a component`;

			return [{ type: "damage_component", agencyID, spacecraftID }];
		} else {
			logger("before")`${["agency", agencyID]} rolled a ${[
				"number",
				damageRoll,
			]} and does not need to damage a component`;
		}
	}

	return [];
}

export function encounterLocation(
	model: Draft<Model>,
	logger: Logger<Game>,
	agencyID: AgencyID,
	spacecraftID: SpacecraftID,
	locationID: LocationID,
	years: number,
	effectIndex: number
): ReducerReturnType<Decision, Interrupt> {
	const location = getLocation(model, locationID);
	if (!location.explorable)
		throw new Error("maneuver location hazard must be explorable!");

	for (let i = effectIndex; i < location.hazard.effects.length; i++) {
		const [decision, ...next] = resolveLocationEffectByType(
			model,
			logger,
			agencyID,
			spacecraftID,
			locationID,
			years,
			i
		);

		if (decision)
			return [
				decision,
				...next,
				{
					kind: "interrupt",
					value: {
						type: "encounter_location",
						agencyID,
						spacecraftID,
						locationID,
						years,
						effectIndex: i + 1,
					},
				},
			];
	}

	return [];
}
