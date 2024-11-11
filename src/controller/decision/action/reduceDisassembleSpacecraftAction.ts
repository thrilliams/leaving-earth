import { deleteSpacecraft } from "../../helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";

export const reduceDisassembleSpacecraftAction: TakeActionReducer<
	"disassemble_spacecraft"
> = (model, _decision, choice) => {
	deleteSpacecraft(model, choice.spacecraftID);
	return [];
};
