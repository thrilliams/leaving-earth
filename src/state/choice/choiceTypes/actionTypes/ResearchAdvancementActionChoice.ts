import { AdvancementID } from "@state/model/advancement/Advancement";
import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";
import type { Immutable } from "laika-engine";
import type { Model } from "@state/model/Model";
import type { TakeActionDecision } from "@state/decision/decisionTypes/TakeActionDecision";
import { getAgency } from "@state/helpers/agency";
import { doesAgencyHaveAdvancement } from "@state/helpers/advancement";

export type ResearchAdvancementActionChoice = z.infer<
	ReturnType<typeof validateResearchAdvancementAction>
>;

export const validateResearchAdvancementAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("research_advancement"),
		advancementID: AdvancementID.superRefine((advancementID, ctx) => {
			const agency = getAgency(model, decision.agencyID);
			if (agency.funds <= 10)
				ctx.addIssue({
					message: "insufficient funds",
					code: "custom",
				});

			if (
				doesAgencyHaveAdvancement(
					model,
					decision.agencyID,
					advancementID
				)
			)
				ctx.addIssue({
					message: "advancement already researched",
					code: "custom",
				});
		}),
	});
