import { drawOutcome } from "../../helpers/outcome";
import type { TakeActionReducer } from "../reduceTakeActionDecision";
import type { Decision } from "../../../state/decision/Decision";
import { getLocation } from "../../../state/helpers/location";
import type { ReducerReturnType } from "laika-engine";
import type { Interrupt } from "../../../state/interrupt/Interrupt";

export const reduceSurveyLocationAction: TakeActionReducer<
	"survey_location"
> = (model, decision, choice) => {
	const [outcome, drawnOutcome] = drawOutcome(
		model,
		decision.agencyID,
		"surveying",
		choice.spacecraftID,
		false
	);

	let revealLocationDecision: Decision | undefined = undefined;
	if (outcome === "success") {
		const location = getLocation(model, choice.locationID);
		if (!location.explorable)
			throw new Error("expected explorable location");
		if (!location.revealed) {
			revealLocationDecision = {
				type: "reveal_location",
				agencyID: decision.agencyID,
				spacecraftID: choice.spacecraftID,
				locationID: choice.locationID,
				locationHazard: location.hazard,
			};
		}
	}

	if (drawnOutcome) {
		const next: ReducerReturnType<Decision, Interrupt> = [
			{
				type: "discard_outcome",
				agencyID: decision.agencyID,
				outcome: drawnOutcome,
				advancementID: "surveying",
				spacecraftID: choice.spacecraftID,
			},
		];

		if (revealLocationDecision) {
			next.push({
				kind: "decision",
				value: revealLocationDecision,
			});
		}

		return next;
	} else if (revealLocationDecision) {
		return [revealLocationDecision];
	}

	return [];
};
