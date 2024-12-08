import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../../game";
import {
	getComponent,
	getComponentDefinition,
	getSpacecraft,
	isComponentOfType,
} from "../../../helpers";
import type {
	AgencyID,
	ComponentID,
	Decision,
	Interrupt,
	Model,
	SpacecraftID,
} from "../../../model";
import { destroyComponent } from "../../helpers/component";
import { drawOutcome } from "../../helpers/outcome";

function destroyCapsuleAndKillAstronauts(
	model: Draft<Model>,
	logger: Logger<Game>,
	componentID: ComponentID,
	spacecraftID: SpacecraftID
) {
	destroyComponent(model, logger, componentID);

	logger("before")`${[
		"component",
		componentID,
	]} was destroyed during reentry`;

	const spacecraft = getSpacecraft(model, spacecraftID);
	for (const astronautID of spacecraft.componentIDs) {
		const astronaut = getComponent(model, astronautID);
		if (!isComponentOfType(model, astronaut, "astronaut")) continue;
		if (astronaut.capsule === componentID)
			destroyComponent(model, logger, astronautID);
	}
}

export function encounterReEntry(
	model: Draft<Model>,
	logger: Logger<Game>,
	agencyID: AgencyID,
	spacecraftID: SpacecraftID,
	componentIDs: ComponentID[]
): ReducerReturnType<Decision, Interrupt> {
	for (let i = 0; i < componentIDs.length; i++) {
		const componentID = componentIDs[i];

		const component = getComponent(model, componentID);
		const definition = getComponentDefinition(model, component.type);

		if (definition.type !== "capsule")
			throw new Error("unexpected component type");

		if (definition.heatShields) {
			// dubious about whether you get the advancement for free here
			const [outcome, drawnOutcome] = drawOutcome(
				model,
				logger,
				agencyID,
				"re_entry",
				spacecraftID,
				true
			);

			if (outcome === "minor_failure") {
				component.damaged = true;

				logger("before")`${[
					"component",
					componentID,
				]} was damaged during reentry`;
			} else if (outcome === "major_failure") {
				destroyCapsuleAndKillAstronauts(
					model,
					logger,
					componentID,
					spacecraftID
				);
			}

			if (drawnOutcome) {
				return [
					{
						type: "discard_outcome",
						agencyID,
						outcome: drawnOutcome,
						advancementID: "re_entry",
						componentID,
						spacecraftID,
					},
					{
						kind: "interrupt",
						value: {
							type: "encounter_re_entry",
							agencyID,
							spacecraftID,
							componentIDs: componentIDs.slice(i + 1),
						},
					},
				];
			}
		} else {
			// capsules without heat shielding are destroyed on reentry
			destroyCapsuleAndKillAstronauts(
				model,
				logger,
				componentID,
				spacecraftID
			);
		}
	}

	return [];
}
