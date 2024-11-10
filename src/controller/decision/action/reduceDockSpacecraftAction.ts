import { getSpacecraft } from "@state/helpers/spacecraft";
import type { TakeActionReducer } from "@controller/decision/reduceTakeActionDecision";
import { drawOutcome } from "@controller/helpers/outcome";
import type { Decision } from "@state/decision/Decision";
import { deleteSpacecraft } from "@controller/helpers/spacecraft";
import type { ReducerReturnType } from "laika-engine";
import type { Interrupt } from "@state/interrupt/Interrupt";

export const reduceDockSpacecraftAction: TakeActionReducer<
	"dock_spacecraft"
> = (model, decision, choice) => {
	const firstSpacecraft = getSpacecraft(model, choice.firstSpacecraftID);
	const secondSpacecraft = getSpacecraft(model, choice.secondSpacecraftID);

	const [outcome, drawnOutcome] = drawOutcome(
		model,
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
	} else {
		firstSpacecraft.componentIDs.push(...secondSpacecraft.componentIDs);
		deleteSpacecraft(model, choice.secondSpacecraftID);
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
