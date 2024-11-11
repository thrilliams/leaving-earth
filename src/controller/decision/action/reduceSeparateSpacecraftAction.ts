import { getSpacecraft } from "../../../state/helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";
import { drawOutcome } from "../../helpers/outcome";
import type { Decision } from "../../../state/decision/Decision";
import { getAgency } from "../../../state/helpers/agency";
import { getNextID } from "../../helpers/id";
import type { ReducerReturnType } from "laika-engine";
import type { Interrupt } from "../../../state/interrupt/Interrupt";

export const reduceSeparateSpacecraftAction: TakeActionReducer<
	"separate_spacecraft"
> = (model, decision, choice) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);

	const [outcome, drawnOutcome] = drawOutcome(
		model,
		decision.agencyID,
		"rendezvous",
		choice.spacecraftID,
		false
	);

	let damageComponentDecision: Decision | undefined = undefined;
	if (outcome === "major_failure" || outcome === "minor_failure") {
		damageComponentDecision = {
			type: "damage_component",
			agencyID: decision.agencyID,
			spacecraftID: choice.spacecraftID,
		};
	} else {
		spacecraft.componentIDs = [...choice.firstComponentIDs];

		const agency = getAgency(model, decision.agencyID);
		const spacecraftID = getNextID(model);
		agency.spacecraft.push({
			id: spacecraftID,
			locationID: spacecraft.locationID,
			componentIDs: [...choice.secondComponentIDs],
			years: 0,
		});
	}

	if (drawnOutcome) {
		const next: ReducerReturnType<Decision, Interrupt> = [
			{
				type: "discard_outcome",
				agencyID: decision.agencyID,
				outcome: drawnOutcome,
				advancementID: "rendezvous",
				spacecraftID: choice.spacecraftID,
			},
		];

		if (damageComponentDecision) {
			next.push({
				kind: "decision",
				value: damageComponentDecision,
			});
		}

		return next;
	} else if (damageComponentDecision) {
		return [damageComponentDecision];
	}

	return [];
};
