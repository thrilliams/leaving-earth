import { destroyComponent } from "../helpers/component";
import { drawOutcome } from "../helpers/outcome";
import { type Decision } from "../../state/decision/Decision";
import { getComponent } from "../../state/helpers/component";
import { getComponentDefinition } from "../../state/helpers/component/definition";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { AgencyID } from "../../state/model/Agency";
import type { ComponentID } from "../../state/model/component/Component";
import type { Model } from "../../state/model/Model";
import type { SpacecraftID } from "../../state/model/Spacecraft";
import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../game";

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
				destroyComponent(model, logger, componentID);

				// TODO: kill astronauts in this capsule

				logger("before")`${[
					"component",
					componentID,
				]} was destroyed during reentry`;
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
							componentIDs: componentIDs.slice(i),
						},
					},
				];
			}
		} else {
			// capsules without heat shielding are destroyed on reentry
			destroyComponent(model, logger, componentID);

			// TODO: kill astronauts in this capsule

			logger("before")`${[
				"component",
				componentID,
			]} was destroyed during reentry`;
		}
	}

	return [];
}
