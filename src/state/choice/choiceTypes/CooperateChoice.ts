import { z } from "zod";
import { BaseChoice } from "../Choice";

export type CooperateChoice = z.infer<ReturnType<typeof validateCooperate>>;

export const validateCooperate = () =>
	BaseChoice.extend({
		type: z.literal("cooperate"),
		accept: z.boolean(),
	});
