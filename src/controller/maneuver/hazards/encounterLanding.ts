import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../../game";
import { doesAgencyHaveAdvancement } from "../../../helpers";
import type {
	AgencyID,
	Decision,
	Interrupt,
	Model,
	SpacecraftID,
} from "../../../model";
import { drawOutcome } from "../../helpers/outcome";
import { destroySpacecraft } from "../../helpers/spacecraft";

export function encounterLanding(
	model: Draft<Model>,
	logger: Logger<Game>,
	agencyID: AgencyID,
	spacecraftID: SpacecraftID
): ReducerReturnType<Decision, Interrupt> {
	if (!doesAgencyHaveAdvancement(model, agencyID, "landing")) {
		destroySpacecraft(model, logger, spacecraftID);

		logger("before")`${[
			"agency",
			agencyID,
		]} did not have landing researched; ${[
			"spacecraft",
			spacecraftID,
		]} was destroyed`;

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
		destroySpacecraft(model, logger, spacecraftID);

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
