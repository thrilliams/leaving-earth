import { encounterLanding } from "../maneuver/encounterLanding";
import type { DecisionReducer } from "../../game";

export const reduceEncounterLandingDecision: DecisionReducer<
	"encounter_landing"
> = (model, decision, choice, logger) => {
	if (!choice.encounter) return [];

	logger("before")`${[
		"agency",
		decision.agencyID,
	]} chose to encounter landing hazard with ${[
		"spacecraft",
		decision.spacecraftID,
	]}`;

	return encounterLanding(
		model,
		logger,
		decision.agencyID,
		decision.spacecraftID
	);
};
