import type { TakeActionReducer } from "@controller/decision/reduceTakeActionDecision";

export const reduceCooperateAction: TakeActionReducer<"cooperate"> = (
	_model,
	decision,
	choice
) => [
	{
		type: "cooperate",
		agencyID: choice.agencyID,
		fromAgencyID: decision.agencyID,

		receiveFunds: choice.giveFunds,
		giveFunds: choice.receiveFunds,
		receiveComponentIDs: [...choice.giveComponentIDs],
		giveComponentIDs: [...choice.receiveComponentIDs],
		receiveSpacecraftIDs: [...choice.giveSpacecraftIDs],
		giveSpacecraftIDs: [...choice.receiveSpacecraftIDs],
		receiveAdvancementIDs: [...choice.giveAdvancementIDs],
		giveAdvancementIDs: [...choice.receiveAdvancementIDs],
	},
	{
		kind: "decision",
		value: {
			type: "take_action",
			agencyID: decision.agencyID,
		},
	},
];
