import { encounterLanding } from "@controller/maneuver/encounterLanding";
import type { DecisionReducer } from "src/game";

export const reduceEncounterLandingDecision: DecisionReducer<
	"encounter_landing"
> = (model, decision, choice) => {
	if (!choice.encounter) return [];
	return encounterLanding(model, decision.agencyID, decision.spacecraftID);
};
