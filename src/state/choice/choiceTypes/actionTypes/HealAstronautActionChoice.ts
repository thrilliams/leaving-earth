import { ComponentID } from "@state/model/component/Component";
import { SpacecraftID } from "@state/model/Spacecraft";
import type { TakeActionDecision } from "@state/decision/decisionTypes/TakeActionDecision";
import { doesAgencyOwnSpacecraft } from "@state/helpers/agency";
import {
	doesSpacecraftExist,
	doesSpacecraftHaveAstronaut,
} from "@state/helpers/spacecraft";
import type { Model } from "@state/model/Model";
import type { Immutable } from "laika-engine";
import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";

export type HealAstronautActionChoice = z.infer<
	ReturnType<typeof validateHealAstronautAction>
>;

export const validateHealAstronautAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("heal_astronauts"),
		spacecraftID: SpacecraftID,
		astronautID: ComponentID,
	}).superRefine((choice, ctx) => {
		if (!doesSpacecraftExist(model, choice.spacecraftID))
			return ctx.addIssue({
				message: "selected spacecraft does not exist",
				path: ["spacecraftID"],
				code: "custom",
			});

		if (
			!doesAgencyOwnSpacecraft(
				model,
				decision.agencyID,
				choice.spacecraftID
			)
		)
			ctx.addIssue({
				message: "selected spacecraft owned by another agency",
				path: ["spacecraftID"],
				code: "custom",
			});

		if (
			!doesSpacecraftHaveAstronaut(
				model,
				choice.spacecraftID,
				true,
				"doctor"
			)
		)
			ctx.addIssue({
				message: "no doctor on board",
				path: ["spacecraftID"],
				code: "custom",
			});

		if (!doesSpacecraftHaveAstronaut(model, choice.spacecraftID, false))
			ctx.addIssue({
				message: "no incapacitated astronauts on board",
				path: ["spacecraftID"],
				code: "custom",
			});
	});
