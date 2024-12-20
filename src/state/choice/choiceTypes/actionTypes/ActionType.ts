import { z } from "zod";
import { BaseChoice } from "../../Choice";

export const ActionType = z.enum([
	"research_advancement",
	"buy_component",
	"assemble_spacecraft",
	"disassemble_spacecraft",
	"perform_maneuver",
	"dock_spacecraft",
	"separate_spacecraft",
	"survey_location",
	"collect_sample",
	"collect_supplies",
	"repair_components",
	"heal_astronauts",
	"cooperate",
	"end_turn",
	// outer planets
	"discard_explorer",
]);

export type ActionType = z.infer<typeof ActionType>;

export const BaseTakeActionChoice = BaseChoice.extend({
	type: z.literal("take_action"),
	action: ActionType,
});
