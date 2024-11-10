import { z } from "zod";
import { BaseChoice } from "../Choice";

export type TurnInValuableSampleChoice = z.infer<
	ReturnType<typeof validateTurnInValuableSample>
>;

export const validateTurnInValuableSample = () =>
	BaseChoice.extend({
		type: z.literal("turn_in_valuable_sample"),
		turnIn: z.boolean(),
	});
