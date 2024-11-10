import {
	doesAgencyHaveAdvancement,
	getAdvancement,
	getAdvancementDefinition,
} from "@state/helpers/advancement";
import { doesSpacecraftHaveAstronaut } from "@state/helpers/spacecraft";
import type { AdvancementID } from "@state/model/advancement/Advancement";
import type { Outcome } from "@state/model/advancement/Outcome";
import type { AgencyID } from "@state/model/Agency";
import type { Model } from "@state/model/Model";
import type { SpacecraftID } from "@state/model/Spacecraft";
import type { Draft } from "laika-engine";
import { giveAdvancement } from "./advancement";

export const drawOutcome = (
	model: Draft<Model>,
	agencyID: AgencyID,
	advancementID: AdvancementID,
	spacecraftID: SpacecraftID | null,
	giveOutcomeIfNotResearched: boolean,
	secondSpacecraftID?: SpacecraftID
): [Outcome, Outcome | null] => {
	if (
		giveOutcomeIfNotResearched &&
		!doesAgencyHaveAdvancement(model, agencyID, advancementID)
	)
		giveAdvancement(model, agencyID, advancementID);

	const advancement = getAdvancement(model, agencyID, advancementID);
	const drawnOutcome = advancement.outcomes.shift() || null;

	let effectiveOutcome = drawnOutcome || "success";
	const definition = getAdvancementDefinition(model, advancement.id);
	if (spacecraftID !== null && definition.speciality !== undefined) {
		if (
			doesSpacecraftHaveAstronaut(
				model,
				spacecraftID,
				true,
				definition.speciality
			) ||
			(secondSpacecraftID &&
				doesSpacecraftHaveAstronaut(
					model,
					secondSpacecraftID,
					true,
					definition.speciality
				))
		) {
			if (effectiveOutcome === "minor_failure")
				effectiveOutcome = "success";
			if (
				effectiveOutcome === "major_failure" &&
				definition.improveMajorFailures
			)
				effectiveOutcome = "minor_failure";
		}
	}

	return [effectiveOutcome, drawnOutcome];
};
