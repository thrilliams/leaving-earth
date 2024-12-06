import type { Draft, Logger } from "laika-engine";
import type { Game } from "../../game";
import { getComponent, getComponentDefinition } from "../../helpers";
import {
	doesAgencyHaveAdvancement,
	getAdvancement,
	getAdvancementDefinition,
} from "../../state/helpers/advancement";
import { getSpacecraft } from "../../state/helpers/spacecraft";
import type { AdvancementID } from "../../state/model/advancement/Advancement";
import type { Outcome } from "../../state/model/advancement/Outcome";
import type { AgencyID } from "../../state/model/Agency";
import type { Model } from "../../state/model/Model";
import type { SpacecraftID } from "../../state/model/Spacecraft";
import { giveAdvancement } from "./advancement";

export const drawOutcome = (
	model: Draft<Model>,
	logger: Logger<Game>,
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
	let drawnOutcome = advancement.outcomes.shift() || null;

	if (drawnOutcome === null) {
		logger("before")`${["agency", agencyID]} defaulted to ${[
			"outcome",
			"success",
		]} from ${["advancement", advancementID]}`;
	} else if (
		drawnOutcome === "success" &&
		advancement.outcomes.length === 0
	) {
		drawnOutcome = null;
		logger("before")`${["agency", agencyID]} drew ${[
			"outcome",
			"success",
		]} from ${[
			"advancement",
			advancementID,
		]} and removed it for free since it was the last outcome`;
	} else {
		logger("before")`${["agency", agencyID]} drew ${[
			"outcome",
			drawnOutcome,
		]} from ${["advancement", advancementID]}`;
	}

	let effectiveOutcome = drawnOutcome || "success";
	const definition = getAdvancementDefinition(model, advancement.id);
	if (spacecraftID !== null && definition.speciality !== undefined) {
		const spacecraft = getSpacecraft(model, spacecraftID);
		const componentIDs = spacecraft.componentIDs.slice();
		if (secondSpacecraftID !== undefined) {
			const secondSpacecraft = getSpacecraft(model, secondSpacecraftID);
			componentIDs.push(...secondSpacecraft.componentIDs);
		}

		for (const componentID of componentIDs) {
			const component = getComponent(model, componentID);
			if (component.damaged) continue;

			const componentDefinition = getComponentDefinition(
				model,
				component.type
			);

			if (componentDefinition.type !== "astronaut") continue;
			if (componentDefinition.speciality !== definition.speciality)
				continue;

			if (effectiveOutcome === "minor_failure") {
				effectiveOutcome = "success";
				logger("before")`${["component", componentID]} improved ${[
					"outcome",
					"minor_failure",
				]} to ${["outcome", "success"]}`;
			}

			if (
				effectiveOutcome === "major_failure" &&
				definition.improveMajorFailures
			) {
				effectiveOutcome = "minor_failure";
				logger("before")`${["component", componentID]} improved ${[
					"outcome",
					"major_failure",
				]} to ${["outcome", "minor_failure"]}`;
			}

			break;
		}
	}

	return [effectiveOutcome, drawnOutcome];
};
