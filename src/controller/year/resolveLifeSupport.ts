import { destroyComponent } from "../helpers/component";
import { drawOutcome } from "../helpers/outcome";
import { type Decision } from "../../state/decision/Decision";
import { getComponent, isComponentOfType } from "../../state/helpers/component";
import { getComponentDefinition } from "../../state/helpers/component/definition";
import { getLocation } from "../../state/helpers/location";
import {
	doesSpacecraftHaveAstronaut,
	getNumberOfSuppliesOnSpacecraft,
	getSpacecraft,
} from "../../state/helpers/spacecraft";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { AgencyID } from "../../state/model/Agency";
import type { ComponentID } from "../../state/model/component/Component";
import type { Model } from "../../state/model/Model";
import type { SpacecraftID } from "../../state/model/Spacecraft";
import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import { consumeSupplies } from "../helpers/spacecraft";
import type { Game } from "../../game";

export const resolveLifeSupport = (
	model: Draft<Model>,
	logger: Logger<Game>,
	agencyID: AgencyID,
	spacecraftID: SpacecraftID,
	remainingComponents?: ComponentID[],
	functionalComponents?: ComponentID[]
): ReducerReturnType<Decision, Interrupt> => {
	const spacecraft = getSpacecraft(model, spacecraftID);

	if (!doesSpacecraftHaveAstronaut(model, spacecraftID, false)) return [];

	const location = getLocation(model, spacecraft.locationID);
	if (location.freeRepairAndHeal) return [];

	let numberOfAstronauts = 0;

	// 1. Any astronaut that is still incapacitated at the end of the year dies.
	if (
		remainingComponents === undefined ||
		functionalComponents === undefined
	) {
		for (const componentID of spacecraft.componentIDs) {
			const astronaut = getComponent(model, componentID);
			if (!isComponentOfType(model, astronaut, "astronaut")) continue;
			if (astronaut.damaged) {
				destroyComponent(model, logger, componentID);

				logger("before")`${[
					"component",
					componentID,
				]} is incapacitated and was killed during life support checks`;

				continue;
			}

			numberOfAstronauts++;
		}

		functionalComponents = [];

		remainingComponents = [];
		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			if (component.damaged) continue;
			const definition = getComponentDefinition(model, component.type);
			if (definition.type !== "capsule") continue;
			remainingComponents.push(componentID);
		}
	}

	// 2. Each agency draws an outcome card from its Life Support advancement
	// for each undamaged capsule that agency has in space to see if life
	// support works (even for unmanned capsules).
	for (let i = 0; i < remainingComponents.length; i++) {
		const componentID = remainingComponents[i];
		const [outcome, drawnOutcome] = drawOutcome(
			model,
			logger,
			agencyID,
			"life_support",
			spacecraftID,
			false
		);

		if (outcome === "success") functionalComponents.push(componentID);

		if (drawnOutcome) {
			return [
				{
					type: "discard_outcome",
					agencyID,

					outcome: drawnOutcome,
					advancementID: "life_support",
					componentID,
					spacecraftID,
				},
				{
					kind: "interrupt",
					value: {
						type: "life_support",
						agencyID,
						spacecraftID,
						remainingComponents: remainingComponents.slice(i + 1),
						functionalComponents,
					},
				},
			];
		}
	}

	let capsuleCapacity = 0;
	for (const componentID of functionalComponents) {
		const component = getComponent(model, componentID);
		const definition = getComponentDefinition(model, component.type);
		if (definition.type !== "capsule")
			throw new Error("expected capsule component");
		capsuleCapacity += definition.capacity;
	}

	// 3. Each card of supplies feeds up to five astronauts.
	const suppliesCapacity =
		getNumberOfSuppliesOnSpacecraft(model, spacecraftID) * 5;

	const actualCapacity = Math.min(capsuleCapacity, suppliesCapacity);
	// if capsules and supplies can support each astronaut, no decision is needed
	if (numberOfAstronauts <= actualCapacity) {
		consumeSupplies(model, logger, spacecraftID, numberOfAstronauts / 5);

		logger("after")`${[
			"spacecraft",
			spacecraftID,
		]} provided life support for all astronauts onboard`;

		return [];
	}

	return [
		{
			type: "life_support",
			agencyID,
			spacecraftID,
			capacity: actualCapacity,
		},
	];
};
