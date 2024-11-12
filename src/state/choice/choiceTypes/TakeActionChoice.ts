import type { TakeActionDecision } from "../../decision/decisionTypes/TakeActionDecision";
import type { Model } from "../../model/Model";
import type { Immutable } from "laika-engine";
import { z } from "zod";
import { validateAssembleSpacecraftAction } from "./actionTypes/AssembleSpacecraftActionChoice";
import { validateBuyComponentAction } from "./actionTypes/BuyComponentActionChoice";
import { validateCollectSampleAction } from "./actionTypes/CollectSampleActionChoice";
import { validateCollectSuppliesAction } from "./actionTypes/CollectSuppliesActionChoice";
import { validateCooperateAction } from "./actionTypes/CooperateActionChoice";
import { validateDisassembleSpacecraftAction } from "./actionTypes/DisassembleSpacecraftActionChoice";
import { validateDockSpacecraftAction } from "./actionTypes/DockSpacecraftActionChoice";
import { validateEndTurnAction } from "./actionTypes/EndTurnActionChoice";
import { validateHealAstronautsAction } from "./actionTypes/HealAstronautActionChoice";
import { validatePerformManeuverAction } from "./actionTypes/PerformManeuverActionChoice";
import { validateRepairComponentsAction } from "./actionTypes/RepairComponentActionChoice";
import { validateResearchAdvancementAction } from "./actionTypes/ResearchAdvancementActionChoice";
import { validateSeparateSpacecraftAction } from "./actionTypes/SeparateSpacecraftActionChoice";
import { validateSurveyLocationAction } from "./actionTypes/SurveyLocationActionChoice";

export type TakeActionChoice = z.infer<ReturnType<typeof validateTakeAction>>;

export const validateTakeAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	z.union([
		validateResearchAdvancementAction(model, decision),
		validateBuyComponentAction(model, decision),
		validateAssembleSpacecraftAction(model, decision),
		validateDisassembleSpacecraftAction(model, decision),
		validatePerformManeuverAction(model, decision),
		validateDockSpacecraftAction(model, decision),
		validateSeparateSpacecraftAction(model, decision),
		validateSurveyLocationAction(model, decision),
		validateCollectSampleAction(model, decision),
		validateCollectSuppliesAction(model, decision),
		validateRepairComponentsAction(model, decision),
		validateHealAstronautsAction(model, decision),
		validateCooperateAction(model, decision),
		validateEndTurnAction(model, decision),
	]);
