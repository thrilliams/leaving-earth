import { z } from "zod";
import { BaseChoice } from "../Choice";

export type RevealLocationChoice = z.infer<
	ReturnType<typeof validateRevealLocation>
>;

export const validateRevealLocation = () =>
	BaseChoice.extend({
		type: z.literal("reveal_location"),
		reveal: z.boolean(),
	});
