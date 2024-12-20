import { destroyComponent } from "../helpers/component";
import { getAgency } from "../../state/helpers/agency";
import { getComponent } from "../../state/helpers/component";
import { getComponentDefinition } from "../../state/helpers/component/definition";
import { getLocation } from "../../state/helpers/location";
import type { ValuableSampleLocationHazardEffect } from "../../state/model/location/locationHazard/LocationHazard";
import type { DecisionReducer } from "../../game";

export const reduceTurnInValuableSampleDecision: DecisionReducer<
	"turn_in_valuable_sample"
> = (model, decision, choice, logger) => {
	if (!choice.turnIn) return [];

	const sample = getComponent(model, decision.sampleID);
	const definition = getComponentDefinition(model, sample.type);
	if (definition.type !== "sample") throw new Error("expected sample");

	const location = getLocation(model, definition.locationID);
	if (!location.explorable) throw new Error("expected explorable location");
	const valuableSampleEffect = location.hazard.effects.find(
		({ type }) => type === "valuable_sample"
	) as ValuableSampleLocationHazardEffect | undefined;

	if (valuableSampleEffect === undefined)
		throw new Error("expected valuable sample effect");

	destroyComponent(model, logger, decision.sampleID);
	const agency = getAgency(model, decision.agencyID);
	agency.funds += valuableSampleEffect.value;

	logger("before")`${["agency", decision.agencyID]} turned in ${[
		"component",
		decision.sampleID,
	]} to receive a $${["number", valuableSampleEffect.value]}`;

	return [];
};
