import { AdvancementID } from "../../model/advancement/Advancement";
import { z } from "zod";
import { BaseChoice } from "../Choice";
import type { Immutable } from "laika-engine";
import type { Model } from "../../model/Model";
import type { TurnInAlienSampleDecision } from "../../decision/decisionTypes/TurnInAlienSampleDecision";
import {
	doesAgencyHaveAdvancement,
	getAdvancement,
} from "../../helpers/advancement";

export type TurnInAlienSampleChoice = z.infer<
	ReturnType<typeof validateTurnInAlienSample>
>;

export const validateTurnInAlienSample = (
	model: Immutable<Model>,
	decision: Immutable<TurnInAlienSampleDecision>
) =>
	BaseChoice.extend({
		type: z.literal("turn_in_alien_sample"),
	}).and(
		z.union([
			z.strictObject({
				turnIn: z.literal(true),
				advancementID: AdvancementID.superRefine(
					(advancementID, ctx) => {
						if (
							doesAgencyHaveAdvancement(
								model,
								decision.agencyID,
								advancementID
							)
						) {
							const advancement = getAdvancement(
								model,
								decision.agencyID,
								advancementID
							);

							if (advancement.outcomes.length === 0)
								ctx.addIssue({
									message:
										"no outcomes can be removed from this advancement",
									code: "custom",
								});
						}
					}
				),
			}),
			z.strictObject({
				turnIn: z.literal(false),
			}),
		])
	);
