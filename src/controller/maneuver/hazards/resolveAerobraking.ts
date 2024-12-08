import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../../game";
import {
	doesAgencyHaveAdvancement,
	getComponent,
	getComponentDefinition,
	getManeuver,
	getSpacecraft,
} from "../../../helpers";
import type {
	Model,
	ManeuverInformation,
	Decision,
	Interrupt,
} from "../../../model";
import { drawOutcome } from "../../helpers/outcome";
import { destroySpacecraft } from "../../helpers/spacecraft";

export function resolveAerobraking(
	model: Draft<Model>,
	logger: Logger<Game>,
	maneuverInformation: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const maneuver = getManeuver(model, maneuverInformation.maneuverID);
	const profile = maneuver.profiles[maneuverInformation.profileIndex];

	const aerobrakingHazard =
		profile.hazards[maneuverInformation.nextHazardIndex];
	if (aerobrakingHazard.type !== "aerobraking")
		throw new Error("expected aerobraking hazard effect");

	if (
		!doesAgencyHaveAdvancement(
			model,
			maneuverInformation.agencyID,
			"aerobraking"
		)
	) {
		destroySpacecraft(model, logger, maneuverInformation.spacecraftID);

		logger("before")`${[
			"agency",
			maneuverInformation.agencyID,
		]} did not have aerobraking researched; ${[
			"spacecraft",
			maneuverInformation.spacecraftID,
		]} was destroyed`;

		return [];
	}

	const [outcome, drawnOutcome] = drawOutcome(
		model,
		logger,
		maneuverInformation.agencyID,
		"aerobraking",
		maneuverInformation.spacecraftID,
		false
	);

	let nextItems: ReducerReturnType<Decision, Interrupt> = [];

	if (outcome === "major_failure") {
		destroySpacecraft(model, logger, maneuverInformation.spacecraftID);

		logger("before")`${[
			"spacecraft",
			maneuverInformation.spacecraftID,
		]} was destroyed while aerobraking`;
	}

	if (outcome === "minor_failure") {
		logger("before")`${[
			"spacecraft",
			maneuverInformation.spacecraftID,
		]} will damage a component and encounter reentry`;

		const spacecraft = getSpacecraft(
			model,
			maneuverInformation.spacecraftID
		);

		const componentIDs = spacecraft.componentIDs.filter((componentID) => {
			const component = getComponent(model, componentID);
			const definition = getComponentDefinition(model, component.type);
			return definition.type === "capsule";
		});

		nextItems = [
			{
				type: "damage_component",
				agencyID: maneuverInformation.agencyID,
				spacecraftID: maneuverInformation.spacecraftID,
			},
			{
				kind: "decision",
				value: {
					type: "assign_astronauts",
					agencyID: maneuverInformation.agencyID,
					spacecraftID: maneuverInformation.spacecraftID,
				},
			},
			{
				kind: "interrupt",
				value: {
					type: "encounter_re_entry",
					agencyID: maneuverInformation.agencyID,
					spacecraftID: maneuverInformation.spacecraftID,
					componentIDs,
				},
			},
		];
	}

	if (drawnOutcome !== null) {
		if (nextItems.length === 0)
			return [
				{
					type: "discard_outcome",
					agencyID: maneuverInformation.agencyID,
					outcome: drawnOutcome,
					advancementID: "aerobraking",
					spacecraftID: maneuverInformation.spacecraftID,
				},
			];

		const [decision, ...next] = nextItems;
		return [
			{
				type: "discard_outcome",
				agencyID: maneuverInformation.agencyID,
				outcome: drawnOutcome,
				advancementID: "aerobraking",
				spacecraftID: maneuverInformation.spacecraftID,
			},
			{
				kind: "decision",
				value: decision!,
			},
			...next,
		];
	}

	return nextItems;
}
