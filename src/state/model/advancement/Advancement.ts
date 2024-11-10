import { z } from "zod";
import type { Outcome } from "./Outcome";

export const AdvancementID = z.enum([
	"juno_rockets",
	"atlas_rockets",
	"soyuz_rockets",
	"saturn_rockets",

	"ion_thrusters",

	"surveying",

	"rendezvous",

	"re_entry",
	"landing",

	"life_support",
]);

export type AdvancementID = z.infer<typeof AdvancementID>;

export type Advancement = {
	id: AdvancementID;
	outcomes: Outcome[];
};
