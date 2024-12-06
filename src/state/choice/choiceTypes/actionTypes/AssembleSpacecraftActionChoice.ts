import type { Immutable } from "laika-engine";
import { z } from "zod";
import { getComponentDefinition } from "../../../../helpers";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesAgencyOwnComponent } from "../../../helpers/agency";
import { doesComponentExist, getComponent } from "../../../helpers/component";
import { isComponentOnSpacecraft } from "../../../helpers/spacecraft";
import { ComponentID } from "../../../model/component/Component";
import type { Model } from "../../../model/Model";
import { BaseTakeActionChoice } from "./ActionType";

export type AssembleSpacecraftActionChoice = z.infer<
	ReturnType<typeof validateAssembleSpacecraftAction>
>;

export const SpacecraftComponentIDs = (model: Immutable<Model>) =>
	ComponentID.array().superRefine((componentIDs, ctx) => {
		if (componentIDs.length === 0)
			ctx.addIssue({
				message: "no components selected",
				code: "custom",
			});

		let runningAstronautCapacity = 0;
		for (let i = 0; i < componentIDs.length; i++) {
			const componentID = componentIDs[i];
			if (!doesComponentExist(model, componentID))
				return ctx.addIssue({
					message: "component does not exist",
					path: [i],
					code: "custom",
				});

			const component = getComponent(model, componentID);
			const definition = getComponentDefinition(model, component.type);
			if (definition.type === "astronaut") runningAstronautCapacity--;
			if (definition.type === "capsule")
				runningAstronautCapacity += definition.capacity;
		}

		if (runningAstronautCapacity < 0)
			ctx.addIssue({
				message: "astronauts exceed capsule capacity",
				code: "custom",
			});
	});

export const validateAssembleSpacecraftAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("assemble_spacecraft"),
		componentIDs: SpacecraftComponentIDs(model),
	}).superRefine((choice, ctx) => {
		for (let i = 0; i < choice.componentIDs.length; i++) {
			const componentID = choice.componentIDs[i];
			if (!doesAgencyOwnComponent(model, decision.agencyID, componentID))
				ctx.addIssue({
					message: "component is owned by another agency",
					path: ["componentIDs", i],
					code: "custom",
				});

			if (isComponentOnSpacecraft(model, componentID))
				ctx.addIssue({
					message: "component already on spacecraft",
					path: ["componentIDs", i],
					code: "custom",
				});
		}
	});
