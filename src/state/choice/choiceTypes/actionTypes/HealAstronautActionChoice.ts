import type { Immutable } from "laika-engine";
import { z } from "zod";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesAgencyOwnSpacecraft } from "../../../helpers/agency";
import {
	doesSpacecraftExist,
	doesSpacecraftHaveAstronaut,
} from "../../../helpers/spacecraft";
import type { Model } from "../../../model/Model";
import { SpacecraftID } from "../../../model/Spacecraft";
import { BaseTakeActionChoice } from "./ActionType";

export type HealAstronautsActionChoice = z.infer<
	ReturnType<typeof validateHealAstronautsAction>
>;

export const validateHealAstronautsAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("heal_astronauts"),
		spacecraftID: SpacecraftID,
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
