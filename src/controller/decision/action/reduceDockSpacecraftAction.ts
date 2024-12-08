import { getSpacecraft } from "../../../state/helpers/spacecraft";
import type { TakeActionReducer } from "../reduceTakeActionDecision";
import { drawOutcome } from "../../helpers/outcome";
import type { Decision } from "../../../state/decision/Decision";
import {
	checkForScientistSampleCompletion,
	deleteSpacecraft,
} from "../../helpers/spacecraft";
import type { ReducerReturnType } from "laika-engine";
import type { Interrupt } from "../../../state/interrupt/Interrupt";
import { getNextID } from "../../helpers/id";
import { getAgency } from "../../../helpers";

export const reduceDockSpacecraftAction: TakeActionReducer<
	"dock_spacecraft"
> = (model, decision, choice, logger) => {
	const firstSpacecraft = getSpacecraft(model, choice.firstSpacecraftID);
	const secondSpacecraft = getSpacecraft(model, choice.secondSpacecraftID);

	const [outcome, drawnOutcome] = drawOutcome(
		model,
		logger,
		decision.agencyID,
		"rendezvous",
		choice.firstSpacecraftID,
		false,
		choice.secondSpacecraftID
	);

	let damageComponentDecision: Decision | undefined = undefined;
	if (outcome === "major_failure" || outcome === "minor_failure") {
		damageComponentDecision = {
			type: "damage_component",
			agencyID: decision.agencyID,
			spacecraftID: choice.firstSpacecraftID,
			secondSpacecraftID: choice.secondSpacecraftID,
		};

		logger("before")`${["agency", decision.agencyID]} failed to dock ${[
			"spacecraft",
			choice.firstSpacecraftID,
		]} with ${["spacecraft", choice.secondSpacecraftID]}`;
	} else {
		const agency = getAgency(model, decision.agencyID);

		logger("before")`${["agency", decision.agencyID]} docked ${[
			"spacecraft",
			choice.firstSpacecraftID,
		]} and ${["spacecraft", choice.secondSpacecraftID]}`;

		const componentIDs = [
			...firstSpacecraft.componentIDs,
			...secondSpacecraft.componentIDs,
		];

		const spacecraftID = getNextID(model);
		agency.spacecraft.push({
			id: spacecraftID,
			locationID: firstSpacecraft.locationID,
			componentIDs,
			years: 0,
		});

		checkForScientistSampleCompletion(model, logger, spacecraftID);

		deleteSpacecraft(model, choice.firstSpacecraftID);
		deleteSpacecraft(model, choice.secondSpacecraftID);

		logger("after")`the resultant spacecraft is ${[
			"spacecraft",
			spacecraftID,
		]}`;
	}

	if (drawnOutcome) {
		const next: ReducerReturnType<Decision, Interrupt> = [
			{
				type: "discard_outcome",
				agencyID: decision.agencyID,
				outcome: drawnOutcome,
				advancementID: "rendezvous",
				spacecraftID: choice.firstSpacecraftID,
				secondSpacecraftID: choice.secondSpacecraftID,
			},
		];

		if (damageComponentDecision !== undefined) {
			next.push({
				kind: "decision",
				value: damageComponentDecision,
			});
		}

		return next;
	} else if (damageComponentDecision !== undefined) {
		return [damageComponentDecision];
	}

	return [];
};
