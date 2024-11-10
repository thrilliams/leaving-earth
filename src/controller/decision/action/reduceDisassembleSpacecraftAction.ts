import { deleteSpacecraft } from "@controller/helpers/spacecraft";
import type { TakeActionReducer } from "@controller/decision/reduceTakeActionDecision";

export const reduceDisassembleSpacecraftAction: TakeActionReducer<
	"disassemble_spacecraft"
> = (model, _decision, choice) => {
	deleteSpacecraft(model, choice.spacecraftID);
	return [];
};
