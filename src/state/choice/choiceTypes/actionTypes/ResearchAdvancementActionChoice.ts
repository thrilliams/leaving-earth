import { AdvancementID } from "../../../model/advancement/Advancement";
import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";
import type { Immutable } from "laika-engine";
import type { Model } from "../../../model/Model";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { getAgency } from "../../../helpers/agency";
import {
	doesAgencyHaveAdvancement,
	getAdvancementDefinition,
} from "../../../helpers/advancement";

export type ResearchAdvancementActionChoice = z.infer<
	ReturnType<typeof validateResearchAdvancementAction>
>;

export const validateResearchAdvancementAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("research_advancement"),
		advancementID: AdvancementID(model.expansions).superRefine(
			(advancementID, ctx) => {
				const agency = getAgency(model, decision.agencyID);
				if (agency.funds < 10)
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

				const advancementDefinition = getAdvancementDefinition(
					model,
					advancementID
				);

				if (
					advancementDefinition.prerequisite !== undefined &&
					!doesAgencyHaveAdvancement(
						model,
						decision.agencyID,
						advancementDefinition.prerequisite
					)
				)
					ctx.addIssue({
						message: "prerequisite not researched",
						code: "custom",
					});
			}
		),
	});
