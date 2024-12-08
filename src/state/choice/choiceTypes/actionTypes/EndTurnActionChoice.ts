import type { Immutable } from "laika-engine";
import { z } from "zod";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import type { Model } from "../../../model/Model";
import { BaseTakeActionChoice } from "./ActionType";

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
