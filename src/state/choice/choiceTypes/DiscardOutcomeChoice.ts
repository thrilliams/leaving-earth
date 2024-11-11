import type { DiscardOutcomeDecision } from "../../decision/decisionTypes/DiscardOutcomeDecision";
import { getAgency } from "../../helpers/agency";
import type { Model } from "../../model/Model";
import type { Immutable } from "laika-engine";
import { z } from "zod";
import { BaseChoice } from "../Choice";

export type DiscardOutcomeChoice = z.infer<
	ReturnType<typeof validateDiscardOutcome>
>;

export const validateDiscardOutcome = (
	model: Immutable<Model>,
	decision: Immutable<DiscardOutcomeDecision>
) =>
	BaseChoice.extend({
		type: z.literal("discard_outcome"),
		discard: z.boolean().superRefine((discard, ctx) => {
			// it's always free to put the outcome back
			if (!discard) return;

			const agency = getAgency(model, decision.agencyID);

			// successes require 10 funds to discard, while failures require 5
			const requiredFunds = decision.outcome === "success" ? 10 : 5;
			if (agency.funds < requiredFunds)
				ctx.addIssue({
					message: "not enough funds to discard this outcome",
					code: "custom",
				});
		}),
	});
