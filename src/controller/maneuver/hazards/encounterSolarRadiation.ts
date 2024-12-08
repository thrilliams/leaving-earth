import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import {
	doesSpacecraftHaveAstronaut,
	getCapsuleDefinitionOfAstronaut,
	getComponent,
	getComponentDefinition,
	getSpacecraft,
} from "../../../helpers";
import type {
	AgencyID,
	Decision,
	Interrupt,
	Model,
	SpacecraftID,
} from "../../../model";
import type { Game } from "../../../game";
import { getD8 } from "../../helpers/rng/number";

export function encounterSolarRadiation(
	model: Draft<Model>,
	logger: Logger<Game>,
	agencyID: AgencyID,
	spacecraftID: SpacecraftID,
	severity: number,
	years: number,
	astronautsAssigned: boolean
): ReducerReturnType<Decision, Interrupt> {
	if (
		!astronautsAssigned &&
		doesSpacecraftHaveAstronaut(model, spacecraftID)
	) {
		return [
			{
				type: "assign_astronauts",
				agencyID,
				spacecraftID,
			},
			{
				kind: "interrupt",
				value: {
					type: "encounter_radiation",
					agencyID,
					spacecraftID,
					severity,
					years,
					astronautsAssigned: true,
				},
			},
		];
	}

	const spacecraft = getSpacecraft(model, spacecraftID);
	for (const componentID of spacecraft.componentIDs) {
		const component = getComponent(model, componentID);
		const definition = getComponentDefinition(model, component.type);
		if (definition.type !== "astronaut") continue;

		const radiationProtection =
			getCapsuleDefinitionOfAstronaut(model, componentID, true)
				?.radiationShielding || 0;

		// radiation protection subtracted from severity
		const effectiveMinimum =
			Math.max(0, severity - radiationProtection) * years;
		if (effectiveMinimum <= 0) continue;

		const radiationRoll = getD8(model);

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

	return [];
}
