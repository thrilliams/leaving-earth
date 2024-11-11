import { SpacecraftID } from "../../../model/Spacecraft";
import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";
import type { Immutable } from "laika-engine";
import type { Model } from "../../../model/Model";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesAgencyOwnSpacecraft } from "../../../helpers/agency";
import { doesSpacecraftExist, getSpacecraft } from "../../../helpers/spacecraft";

export type DisassembleSpacecraftActionChoice = z.infer<
	ReturnType<typeof validateDisassembleSpacecraftAction>
>;

export const validateDisassembleSpacecraftAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("disassemble_spacecraft"),
		spacecraftID: SpacecraftID.superRefine((spacecraftID, ctx) => {
			if (!doesSpacecraftExist(model, spacecraftID))
				return ctx.addIssue({
					message: "selected spacecraft does not exist",
					code: "custom",
				});

			if (
				!doesAgencyOwnSpacecraft(model, decision.agencyID, spacecraftID)
			)
				ctx.addIssue({
					message: "selected spacecraft owned by another agency",
					code: "custom",
				});

			const spacecraft = getSpacecraft(model, spacecraftID);
			if (spacecraft.locationID !== "earth")
				ctx.addIssue({
					message: "spacecraft may only be disassembled on earth",
					code: "custom",
				});
		}),
	});
