import {
	doesAgencyHaveAdvancement,
	getAdvancementDefinition,
} from "@state/helpers/advancement";
import { getAgency } from "@state/helpers/agency";
import type { AdvancementID } from "@state/model/advancement/Advancement";
import type { Outcome } from "@state/model/advancement/Outcome";
import type { AgencyID } from "@state/model/Agency";
import type { Model } from "@state/model/Model";
import type { Draft } from "laika-engine";
import { getRandomNumber } from "@controller/helpers/rng/number";

export const giveAdvancement = (
	model: Draft<Model>,
	agencyID: AgencyID,
	advancementID: AdvancementID
) => {
	if (doesAgencyHaveAdvancement(model, agencyID, advancementID)) return;

	const definition = getAdvancementDefinition(model, advancementID);
	const outcomes: Outcome[] = [];
	for (let i = 0; i < definition.startingOutcomes; i++) {
		const randomNumber = getRandomNumber(model, 1, 6);
		if (randomNumber <= 4) {
			outcomes.push("success");
		} else if (randomNumber <= 5) {
			outcomes.push("minor_failure");
		} else {
			outcomes.push("major_failure");
		}
	}

	const agency = getAgency(model, agencyID);
	agency.advancements[advancementID] = {
		id: advancementID,
		outcomes,
	};
};
