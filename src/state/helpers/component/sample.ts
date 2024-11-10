import type { ComponentID } from "@state/model/component/Component";
import type {
	LocationHazardEffect,
	LocationHazardEffectType,
} from "@state/model/location/locationHazard/LocationHazard";
import type { Model } from "@state/model/Model";
import type { MatchReadonly, MaybeDraft } from "laika-engine";
import { getComponent } from "../component";
import { getComponentDefinition } from "./definition";
import { getLocation } from "../location";

export function getSampleEffectOfType<
	M extends MaybeDraft<Model>,
	T extends LocationHazardEffectType
>(model: M, sampleID: ComponentID, effectType: T) {
	const sample = getComponent(model, sampleID);

	const definition = getComponentDefinition(model, sample.type);
	if (definition.type !== "sample") return;

	const location = getLocation(model, definition.locationID);
	if (!location.explorable) return;

	const sampleEffect = location.hazard?.effects.find(
		({ type }) => type === effectType
	);

	if (sampleEffect !== undefined)
		return sampleEffect as MatchReadonly<M, LocationHazardEffect<T>>;
}
