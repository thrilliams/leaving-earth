import { z } from "zod";
import type { Outcome } from "./Outcome";
import type { ExpansionID } from "../../expansion/ExpansionID";
import type { MaybeDraft } from "laika-engine";

const baseGameAdvancementIDs = [
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
] as const;

const outerPlanetsAdvancementIDs = ["aerobraking", "proton_rockets"] as const;

export const AdvancementID = (expansions: MaybeDraft<ExpansionID[]>) =>
	z
		.enum([...baseGameAdvancementIDs, ...outerPlanetsAdvancementIDs])
		.refine((advancementID) => {
			if (
				baseGameAdvancementIDs.includes(
					advancementID as (typeof baseGameAdvancementIDs)[number]
				)
			)
				return true;

			if (
				outerPlanetsAdvancementIDs.includes(
					advancementID as (typeof outerPlanetsAdvancementIDs)[number]
				)
			)
				return expansions.includes("outer_planets");
		});

export type AdvancementID = z.infer<ReturnType<typeof AdvancementID>>;

export type Advancement = {
	id: AdvancementID;
	outcomes: Outcome[];
};
