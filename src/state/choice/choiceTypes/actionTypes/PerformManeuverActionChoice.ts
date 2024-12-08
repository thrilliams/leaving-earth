import type { Immutable } from "laika-engine";
import { z } from "zod";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import type { ManeuverInformation } from "../../../decision/maneuverInformation/ManeuverInformation";
import { validateManeuverInformation } from "../../../decision/maneuverInformation/validateManeuverInformation";
import type { Model } from "../../../model/Model";
import { SpacecraftID } from "../../../model/Spacecraft";
import { ComponentID } from "../../../model/component/Component";
import { ManeuverID } from "../../../model/location/maneuver/Maneuver";
import { BaseTakeActionChoice } from "./ActionType";

export const performManeuverActionToManeuverInformation = (
	decision: TakeActionDecision,
	choice: PerformManeuverActionChoice
): ManeuverInformation => ({
	agencyID: decision.agencyID,
	spacecraftID: choice.spacecraftID,
	maneuverID: choice.maneuverID,
	profileIndex: choice.profileIndex,
	durationModifier: choice.durationModifier,
	rocketIDs: choice.rocketIDs,
	spentRocketIDs: [],
	generatedThrust: 0,
	nextHazardIndex: 0,
});

export type PerformManeuverActionChoice = z.infer<
	ReturnType<typeof validatePerformManeuverAction>
>;

export const validatePerformManeuverAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("perform_maneuver"),
		maneuverID: ManeuverID(model.expansions),
		profileIndex: z.number().int().min(0),
		spacecraftID: SpacecraftID,
		durationModifier: z.number().int(),
		rocketIDs: ComponentID.array(),
	}).superRefine((choice, ctx) => {
		const maneuverInformation = performManeuverActionToManeuverInformation(
			decision,
			choice
		);

		validateManeuverInformation(model, maneuverInformation, ctx);
	});
