import { z } from "zod";
import { ComponentID } from "../../../model/component/Component";
import { BaseTakeActionChoice } from "./ActionType";
import type { Immutable } from "laika-engine";
import type { Model } from "../../../model/Model";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesComponentExist } from "../../../helpers/component";
import { isComponentOnSpacecraft } from "../../../helpers/spacecraft";
import { doesAgencyOwnComponent } from "../../../helpers/agency";

export type AssembleSpacecraftActionChoice = z.infer<
	ReturnType<typeof validateAssembleSpacecraftAction>
>;

export const validateAssembleSpacecraftAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("assemble_spacecraft"),
		componentIDs: ComponentID.array(),
	}).superRefine((choice, ctx) => {
		for (let i = 0; i < choice.componentIDs.length; i++) {
			const componentID = choice.componentIDs[i];
			if (!doesComponentExist(model, componentID))
				return ctx.addIssue({
					message: "component does not exist",
					path: [i],
					code: "custom",
				});

			if (!doesAgencyOwnComponent(model, decision.agencyID, componentID))
				ctx.addIssue({
					message: "component is owned by another agency",
					path: [i],
					code: "custom",
				});

			if (isComponentOnSpacecraft(model, componentID))
				ctx.addIssue({
					message: "component already on spacecraft",
					path: [i],
					code: "custom",
				});
		}
	});
