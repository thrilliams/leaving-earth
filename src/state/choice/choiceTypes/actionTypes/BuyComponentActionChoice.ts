import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";
import { ComponentDefinitionID } from "@state/model/component/ComponentDefinition";
import type { Immutable } from "laika-engine";
import type { Model } from "@state/model/Model";
import type { Decision } from "@state/decision/Decision";
import { getComponentDefinition } from "@state/helpers/component/definition";
import { doesAgencyHaveAdvancement } from "@state/helpers/advancement";
import { getAgency } from "@state/helpers/agency";

export type BuyComponentActionChoice = z.infer<
	ReturnType<typeof validateBuyComponentAction>
>;

export const validateBuyComponentAction = (
	model: Immutable<Model>,
	decision: Immutable<Decision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("buy_component"),
		componentDefinitionID: ComponentDefinitionID,
	}).superRefine((choice, ctx) => {
		const definition = getComponentDefinition(
			model,
			choice.componentDefinitionID
		);

		if (
			"advancementID" in definition &&
			!doesAgencyHaveAdvancement(
				model,
				decision.agencyID,
				definition.advancementID
			)
		)
			ctx.addIssue({
				message: "prerequisite advancement not researched",
				code: "custom",
			});

		if (!("cost" in definition))
			return ctx.addIssue({
				message: "selected component not purchasable",
				code: "custom",
			});

		const agency = getAgency(model, decision.agencyID);
		if (agency.funds < definition.cost)
			ctx.addIssue({
				message: "insufficient funds for purchase",
				code: "custom",
			});
	});
