import { ComponentID } from "../../model/component/Component";
import { z } from "zod";
import { BaseChoice } from "../Choice";
import type { Immutable } from "laika-engine";
import type { Model } from "../../model/Model";
import type { DamageComponentDecision } from "../../decision/decisionTypes/DamageComponentDecision";
import {
	doesComponentExist,
	isComponentDamaged,
	isComponentOfDamageableType,
} from "../../helpers/component";
import { getSpacecraft } from "../../helpers/spacecraft";

export type DamageComponentChoice = z.infer<
	ReturnType<typeof validateDamageComponent>
>;

export const validateDamageComponent = (
	model: Immutable<Model>,
	decision: DamageComponentDecision
) =>
	BaseChoice.extend({
		type: z.literal("damage_component"),
		componentID: ComponentID.optional(),
	}).superRefine((choice, ctx) => {
		const spacecraft = getSpacecraft(model, decision.spacecraftID);
		// shallow copy so we can add other spacecraft if applicable
		const componentIDs = spacecraft.componentIDs.slice();

		// add other spacecraft if applicable
		if (decision.secondSpacecraftID !== undefined) {
			const secondSpacecraft = getSpacecraft(
				model,
				decision.secondSpacecraftID
			);
			componentIDs.push(...secondSpacecraft.componentIDs);
		}

		if (choice.componentID === undefined) {
			// if spacecraft has no undamaged (damageable) components, no component may be chosen
			if (
				componentIDs.every(
					(id) =>
						!isComponentOfDamageableType(model, id) ||
						isComponentDamaged(model, id)
				)
			)
				return;

			// else, one must be
			return ctx.addIssue({
				message: "no component chosen to damage",
				path: ["componentID"],
				code: "custom",
			});
		}

		if (!doesComponentExist(model, choice.componentID))
			return ctx.addIssue({
				message: "component does not exist",
				path: ["componentID"],
				code: "custom",
			});

		if (!componentIDs.includes(choice.componentID))
			ctx.addIssue({
				message: "component not present on spacecraft",
				path: ["componentID"],
				code: "custom",
			});

		if (isComponentDamaged(model, choice.componentID))
			ctx.addIssue({
				message: "component already damaged",
				path: ["componentID"],
				code: "custom",
			});

		if (!isComponentOfDamageableType(model, choice.componentID))
			ctx.addIssue({
				message: "component may not be chosen to be damaged",
				path: ["componentID"],
				code: "custom",
			});
	});
