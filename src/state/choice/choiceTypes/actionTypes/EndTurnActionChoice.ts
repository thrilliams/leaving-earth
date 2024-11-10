import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";
import type { Immutable } from "laika-engine";
import type { Model } from "@state/model/Model";
import type { TakeActionDecision } from "@state/decision/decisionTypes/TakeActionDecision";

export type EndTurnActionChoice = z.infer<
	ReturnType<typeof validateEndTurnAction>
>;

export const validateEndTurnAction = (
	_model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("end_turn"),
		pass: z.boolean(),
	}).superRefine((choice, ctx) => {
		if (decision.firstOfTurn && !choice.pass)
			ctx.addIssue({
				message: "must pass if end turn action is first action of turn",
				path: ["pass"],
				code: "custom",
			});
	});
