import { giveAdvancement } from "../helpers/advancement";
import { createGiveAndReceiveTransfers } from "../../state/decision/resourceTransfer/createGiveAndReceiveTransfers";
import type { ResourceTransfer } from "../../state/decision/resourceTransfer/ResourceTransfer";
import {
	doesAgencyHaveAdvancement,
	getAdvancement,
} from "../../state/helpers/advancement";
import { getAgency } from "../../state/helpers/agency";
import { getSpacecraft } from "../../state/helpers/spacecraft";
import type { AgencyID } from "../../state/model/Agency";
import type { ComponentID } from "../../state/model/component/Component";
import type { Model } from "../../state/model/Model";
import type { Draft } from "laika-engine";
import type { DecisionReducer } from "../../game";

function transferComponents(
	model: Draft<Model>,
	fromID: AgencyID,
	toID: AgencyID,
	componentIDs: ComponentID[]
) {
	const from = getAgency(model, fromID);
	const to = getAgency(model, toID);

	to.passedThisYear = false;
	to.components.push(
		...from.components.filter(({ id }) => componentIDs.includes(id))
	);

	from.components = from.components.filter(
		({ id }) => !componentIDs.includes(id)
	);
}

function resolveResourceTransfer(
	model: Draft<Model>,
	resourceTransfer: ResourceTransfer
) {
	const from = getAgency(model, resourceTransfer.from);
	const to = getAgency(model, resourceTransfer.to);

	from.funds -= resourceTransfer.funds;
	to.funds += resourceTransfer.funds;

	transferComponents(
		model,
		resourceTransfer.from,
		resourceTransfer.to,
		resourceTransfer.components
	);

	for (const spacecraftID of resourceTransfer.spacecraft) {
		const spacecraft = getSpacecraft(model, spacecraftID);
		transferComponents(
			model,
			resourceTransfer.from,
			resourceTransfer.to,
			spacecraft.componentIDs
		);

		from.spacecraft.splice(
			from.spacecraft.findIndex(({ id }) => id === spacecraftID),
			1
		);
		to.spacecraft.push(spacecraft);
	}

	for (const advancementID of resourceTransfer.advancements) {
		// give advancement
		if (
			!doesAgencyHaveAdvancement(
				model,
				resourceTransfer.to,
				advancementID
			)
		)
			giveAdvancement(model, resourceTransfer.to, advancementID);

		// set number of outcomes
		const fromAdvancement = getAdvancement(
			model,
			resourceTransfer.from,
			advancementID
		);
		const toAdvancement = getAdvancement(
			model,
			resourceTransfer.to,
			advancementID
		);
		toAdvancement.outcomes = toAdvancement.outcomes.slice(
			0,
			fromAdvancement.outcomes.length
		);
	}
}

export const reduceCooperateDecision: DecisionReducer<"cooperate"> = (
	model,
	decision,
	choice
) => {
	if (!choice.accept) return [];

	const [give, receive] = createGiveAndReceiveTransfers(
		decision.fromAgencyID,
		decision.agencyID,
		decision
	);

	resolveResourceTransfer(model, give);
	resolveResourceTransfer(model, receive);

	return [];
};
