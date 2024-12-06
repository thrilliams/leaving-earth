import { drawOutcome } from "../helpers/outcome";
import { destroySpacecraft } from "../helpers/spacecraft";
import type { Decision } from "../../state/decision/Decision";
import { doesAgencyHaveAdvancement } from "../../state/helpers/advancement";
import type { Interrupt } from "../../state/interrupt/Interrupt";
import type { AgencyID } from "../../state/model/Agency";
import type { Model } from "../../state/model/Model";
import type { SpacecraftID } from "../../state/model/Spacecraft";
import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../game";

export function encounterLanding(
	model: Draft<Model>,
	logger: Logger<Game>,
	agencyID: AgencyID,
	spacecraftID: SpacecraftID
): ReducerReturnType<Decision, Interrupt> {
	if (!doesAgencyHaveAdvancement(model, agencyID, "landing")) {
		destroySpacecraft(model, spacecraftID);
		return [];
	}

	const [outcome, drawnOutcome] = drawOutcome(
		model,
		logger,
		agencyID,
		"landing",
		spacecraftID,
		false
	);

	if (outcome === "major_failure") {
		destroySpacecraft(model, spacecraftID);

		logger("before")`${[
			"spacecraft",
			spacecraftID,
		]} was destroyed during landing`;

		return [];
	}

	let damageComponentDecision: Decision | undefined = undefined;
	if (outcome === "minor_failure")
		damageComponentDecision = {
			type: "damage_component",
			agencyID: agencyID,
			spacecraftID: spacecraftID,
		};

	if (drawnOutcome) {
		const next: ReducerReturnType<Decision, Interrupt> = [
			{
				type: "discard_outcome",
				agencyID,
				outcome: drawnOutcome,
				advancementID: "landing",
				spacecraftID,
			},
		];

		if (damageComponentDecision) {
			next.push({
				kind: "decision",
				value: damageComponentDecision,
			});
		}

		return next;
	}

	if (damageComponentDecision) return [damageComponentDecision];
	return [];
}
