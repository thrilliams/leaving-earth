import type { Immutable } from "laika-engine";
import { z } from "zod";
import type { Decision } from "../../../decision/Decision";
import { doesAgencyHaveAdvancement } from "../../../helpers/advancement";
import { getAgency } from "../../../helpers/agency";
import { getComponentDefinition } from "../../../helpers/component/definition";
import { ComponentDefinitionID } from "../../../model/component/ComponentDefinition";
import type { Model } from "../../../model/Model";
import { BaseTakeActionChoice } from "./ActionType";

export type BuyComponentActionChoice = z.infer<
	ReturnType<typeof validateBuyComponentAction>
>;

export const validateBuyComponentAction = (
	model: Immutable<Model>,
	decision: Immutable<Decision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("buy_component"),
		componentDefinitionID: ComponentDefinitionID(model.expansions),
	}).superRefine((choice, ctx) => {
		const definition = getComponentDefinition(
			model,
			choice.componentDefinitionID
		);

		if (
			"advancementID" in definition &&
			definition.advancementID !== undefined &&
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
