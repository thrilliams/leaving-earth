import { z } from "zod";
import { BaseChoice } from "../Choice";

export type EncounterLandingChoice = z.infer<
	ReturnType<typeof validateEncounterLanding>
>;

export const validateEncounterLanding = () =>
	BaseChoice.extend({
		type: z.literal("encounter_landing"),
		encounter: z.boolean(),
	});
