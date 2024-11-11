import { reduceAssembleSpacecraftAction } from "./action/reduceAssembleSpacecraftAction";
import { reduceBuyComponentAction } from "./action/reduceBuyComponentAction";
import { reduceCollectSampleAction } from "./action/reduceCollectSampleAction";
import { reduceCollectSuppliesAction } from "./action/reduceCollectSuppliesAction";
import { reduceCooperateAction } from "./action/reduceCooperateAction";
import { reduceDisassembleSpacecraftAction } from "./action/reduceDisassembleSpacecraftAction";
import { reduceDockSpacecraftAction } from "./action/reduceDockSpacecraftAction";
import { reduceEndTurnAction } from "./action/reduceEndTurnAction";
import { reduceHealAstronautsAction } from "./action/reduceHealAstronautsAction";
import { reducePerformManeuverAction } from "./action/reducePerformManeuverAction";
import { reduceRepairComponentsAction } from "./action/reduceRepairComponentsAction";
import { reduceResearchAdvancementAction } from "./action/reduceResearchAdvancementAction";
import { reduceSeparateSpacecraftAction } from "./action/reduceSeparateSpacecraftAction";
import { reduceSurveyLocationAction } from "./action/reduceSurveyLocationAction";
import type { Model } from "../../state/model/Model";
import type { TakeActionChoice } from "../../state/choice/choiceTypes/TakeActionChoice";
import type { Decision } from "../../state/decision/Decision";
import type { TakeActionDecision } from "../../state/decision/decisionTypes/TakeActionDecision";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { Draft, Immutable, ReducerReturnType } from "laika-engine";
import type { DecisionReducer } from "../../game";

export type TakeActionReducer<A extends TakeActionChoice["action"]> = (
	model: Draft<Model>,
	decision: Immutable<TakeActionDecision>,
	choice: Immutable<TakeActionChoice & { action: A }>
) => ReducerReturnType<Decision, Interrupt>;

export const reduceActionByType: DecisionReducer<"take_action"> = (
	model,
	decision,
	choice
) => {
	if (choice.action === "research_advancement")
		return reduceResearchAdvancementAction(model, decision, choice);
	if (choice.action === "buy_component")
		return reduceBuyComponentAction(model, decision, choice);
	if (choice.action === "assemble_spacecraft")
		return reduceAssembleSpacecraftAction(model, decision, choice);
	if (choice.action === "disassemble_spacecraft")
		return reduceDisassembleSpacecraftAction(model, decision, choice);
	if (choice.action === "perform_maneuver")
		return reducePerformManeuverAction(model, decision, choice);
	if (choice.action === "dock_spacecraft")
		return reduceDockSpacecraftAction(model, decision, choice);
	if (choice.action === "separate_spacecraft")
		return reduceSeparateSpacecraftAction(model, decision, choice);
	if (choice.action === "survey_location")
		return reduceSurveyLocationAction(model, decision, choice);
	if (choice.action === "collect_sample")
		return reduceCollectSampleAction(model, decision, choice);
	if (choice.action === "collect_supplies")
		return reduceCollectSuppliesAction(model, decision, choice);
	if (choice.action === "repair_components")
		return reduceRepairComponentsAction(model, decision, choice);
	if (choice.action === "heal_astronauts")
		return reduceHealAstronautsAction(model, decision, choice);
	if (choice.action === "cooperate")
		return reduceCooperateAction(model, decision, choice);
	if (choice.action === "end_turn")
		return reduceEndTurnAction(model, decision, choice);
	throw new Error("unexpected action type");
};

export const reduceTakeActionDecision: DecisionReducer<"take_action"> = (
	model,
	decision,
	choice
) => {
	const [nextDecision, ...next] = reduceActionByType(model, decision, choice);

	if (nextDecision) {
		// if the next decision is a take action decision, or if there is one in the next queue, return as-is
		if (
			nextDecision.type === "take_action" ||
			(next.length > 0 &&
				next.find(
					({ kind, value }) =>
						kind === "decision" && value.type === "take_action"
				))
		)
			return [nextDecision, ...next];

		// else, append a take action decision
		return [
			nextDecision,
			...next,
			{
				kind: "decision",
				value: {
					type: "take_action",
					agencyID: decision.agencyID,
					firstOfTurn: false,
				},
			},
		];
	}

	return [
		{
			type: "take_action",
			agencyID: decision.agencyID,
			firstOfTurn: false,
		},
	];
};
