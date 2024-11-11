import { ComponentID } from "../../model/component/Component";
import { z } from "zod";
import { BaseChoice } from "../Choice";
import type { Immutable } from "laika-engine";
import type { Model } from "../../model/Model";
import type { ContinueManeuverDecision } from "../../decision/decisionTypes/ContinueManeuverDecision";
import type { ManeuverInformation } from "../../decision/maneuverInformation/ManeuverInformation";
import { validateManeuverInformation } from "../../decision/maneuverInformation/validateManeuverInformation";

export const continueManeuverToManeuverInformation = (
	decision: Immutable<ContinueManeuverDecision>,
	choice: Immutable<ContinueManeuverChoice>
): ManeuverInformation => ({
	agencyID: decision.agencyID,
	spacecraftID: decision.spacecraftID,
	maneuverID: decision.maneuverID,
	durationModifier:
		choice.durationModifier !== undefined
			? choice.durationModifier
			: decision.durationModifier,
	rocketIDs: [...(choice.rocketIDs || decision.rocketIDs)],
	spentRocketIDs: [...decision.spentRocketIDs],
	generatedThrust: decision.generatedThrust,
	nextHazard: decision.nextHazard,
	astronautsAssigned: decision.astronautsAssigned,
});

export type ContinueManeuverChoice = z.infer<
	ReturnType<typeof validateContinueManeuver>
>;

export const validateContinueManeuver = (
	model: Immutable<Model>,
	decision: Immutable<ContinueManeuverDecision>
) =>
	BaseChoice.extend({
		type: z.literal("continue_maneuver"),
		proceed: z.boolean(),
		durationModifier: z.number().int().optional(),
		rocketIDs: ComponentID.array().optional(),
	}).superRefine((choice, ctx) => {
		const maneuverInformation = continueManeuverToManeuverInformation(
			decision,
			choice
		);

		validateManeuverInformation(model, maneuverInformation, ctx);
	});
