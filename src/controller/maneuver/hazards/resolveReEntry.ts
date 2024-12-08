import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../../game";
import {
	doesSpacecraftHaveAstronaut,
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
import { encounterReEntry } from "./encounterReEntry";

export function resolveReEntry(
	model: Draft<Model>,
	logger: Logger<Game>,
	maneuverInformation: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const maneuver = getManeuver(model, maneuverInformation.maneuverID);
	const profile = maneuver.profiles[maneuverInformation.profileIndex];

	const reEntryHazard = profile.hazards[maneuverInformation.nextHazardIndex];
	if (reEntryHazard.type !== "re_entry")
		throw new Error("expected re_entry hazard effect");

	const spacecraft = getSpacecraft(model, maneuverInformation.spacecraftID);

	const componentIDs = spacecraft.componentIDs.filter((componentID) => {
		const component = getComponent(model, componentID);
		const definition = getComponentDefinition(model, component.type);
		return definition.type === "capsule";
	});

	if (doesSpacecraftHaveAstronaut(model, maneuverInformation.spacecraftID))
		return [
			{
				type: "assign_astronauts",
				agencyID: maneuverInformation.agencyID,
				spacecraftID: maneuverInformation.spacecraftID,
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
			{
				kind: "interrupt",
				value: {
					type: "continue_maneuver",
					...maneuverInformation,
					nextHazardIndex: maneuverInformation.nextHazardIndex + 1,
				},
			},
		];

	const [decision, ...next] = encounterReEntry(
		model,
		logger,
		maneuverInformation.agencyID,
		maneuverInformation.spacecraftID,
		componentIDs
	);

	if (decision)
		return [
			decision,
			...next,
			{
				kind: "interrupt",
				value: {
					type: "continue_maneuver",
					...maneuverInformation,
					nextHazardIndex: maneuverInformation.nextHazardIndex + 1,
				},
			},
		];

	return [];
}
