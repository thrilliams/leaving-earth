import { getSpacecraft } from "../../../state/helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";
import { drawOutcome } from "../../helpers/outcome";
import type { Decision } from "../../../state/decision/Decision";
import { getAgency } from "../../../state/helpers/agency";
import { getNextID } from "../../helpers/id";
import type { ReducerReturnType } from "laika-engine";
import type { Interrupt } from "../../../state/interrupt/Interrupt";
import { deleteSpacecraft } from "../../helpers/spacecraft";

export const reduceSeparateSpacecraftAction: TakeActionReducer<
	"separate_spacecraft"
> = (model, decision, choice, logger) => {
	const spacecraft = getSpacecraft(model, choice.spacecraftID);

	const [outcome, drawnOutcome] = drawOutcome(
		model,
		logger,
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

		logger("before")`${["agency", decision.agencyID]} failed to separate ${[
			"spacecraft",
			choice.spacecraftID,
		]}`;
	} else {
		const agency = getAgency(model, decision.agencyID);

		logger("before")`${["agency", decision.agencyID]} separated ${[
			"spacecraft",
			choice.spacecraftID,
		]}`;

		const firstSpacecraftID = getNextID(model);
		agency.spacecraft.push({
			id: firstSpacecraftID,
			locationID: spacecraft.locationID,
			componentIDs: [...choice.firstComponentIDs],
			years: 0,
		});

		const secondSpacecraftID = getNextID(model);
		agency.spacecraft.push({
			id: secondSpacecraftID,
			locationID: spacecraft.locationID,
			componentIDs: [...choice.secondComponentIDs],
			years: 0,
		});

		deleteSpacecraft(model, choice.spacecraftID);

		logger("after")`the resultant spacecraft are ${[
			"spacecraft",
			firstSpacecraftID,
		]} and ${["spacecraft", secondSpacecraftID]}`;
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
