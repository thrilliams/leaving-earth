import { deleteSpacecraft } from "../../helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";

export const reduceDisassembleSpacecraftAction: TakeActionReducer<
	"disassemble_spacecraft"
> = (model, decision, choice, logger) => {
	deleteSpacecraft(model, choice.spacecraftID);

	logger("before")`${["agency", decision.agencyID]} disassembled ${[
		"spacecraft",
		choice.spacecraftID,
	]}`;

	return [];
};
