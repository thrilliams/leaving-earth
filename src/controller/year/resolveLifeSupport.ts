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
import type { Draft, ReducerReturnType } from "laika-engine";

export const resolveLifeSupport = (
	model: Draft<Model>,
	agencyID: AgencyID,
	spacecraftID: SpacecraftID,
	remainingComponents?: ComponentID[],
	functionalComponents?: ComponentID[]
): ReducerReturnType<Decision, Interrupt> => {
	const spacecraft = getSpacecraft(model, spacecraftID);

	if (!doesSpacecraftHaveAstronaut(model, spacecraftID, false)) return [];

	const location = getLocation(model, spacecraft.locationID);
	if (location.freeRepairAndHeal) return [];

	// 1. Any astronaut that is still incapacitated at the end of the year dies.
	if (
		remainingComponents === undefined ||
		functionalComponents === undefined
	) {
		for (const componentID of spacecraft.componentIDs) {
			const astronaut = getComponent(model, componentID);
			if (!isComponentOfType(model, astronaut, "astronaut")) continue;
			if (astronaut.damaged) {
				destroyComponent(model, componentID);
				continue;
			}
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
						remainingComponents: remainingComponents.slice(i),
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

	return [
		{
			type: "life_support",
			agencyID,
			spacecraftID,
			capacity: Math.min(capsuleCapacity, suppliesCapacity),
		},
	];
};
