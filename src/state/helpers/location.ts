import type { MatchReadonly, MaybeDraft } from "laika-engine";
import type {
	LocationHazardEffect,
	LocationHazardEffectType,
	Model,
} from "../../model";
import { LocationID } from "../model/location/Location";
import { predicate, selector } from "./wrappers";

/**
 * returns the location with the given ID, or errors if none exists
 */
export const getLocation = selector((model, locationID: LocationID) => {
	const location = model.locations[locationID];
	if (location !== undefined) return location;
	throw new Error("location ID could not be resolved");
});

export const getSurveyableLocations = predicate(
	(model, locationID: LocationID) => {
		const surveyableLocations = new Set<LocationID>();

		const originLocation = getLocation(model, locationID);
		for (const maneuver of originLocation.maneuvers) {
			for (
				let profileIndex = 0;
				profileIndex < maneuver.profiles.length;
				profileIndex++
			) {
				for (const hazard of maneuver.profiles[profileIndex].hazards) {
					if (hazard.type !== "location") continue;

					const hazardLocation = getLocation(
						model,
						hazard.locationID
					);

					if (
						hazardLocation.explorable &&
						!hazardLocation.astronautOnly
					)
						surveyableLocations.add(hazard.locationID);
				}
			}
		}

		return Array.from(surveyableLocations);
	}
);

export const doesLocationHaveSample = predicate(
	(model, locationID: LocationID) =>
		Object.values(model.componentDefinitions).find(
			(definition) =>
				definition.type === "sample" &&
				definition.locationID === locationID
		) !== undefined
);

export const doesLocationHaveEffectOfType = predicate(
	(model, locationID: LocationID, effectType: LocationHazardEffectType) => {
		const location = getLocation(model, locationID);
		if (!location.explorable) return false;
		const effects = location.hazard.effects.filter(
			({ type }) => type === effectType
		);
		return effects.length !== 0;
	}
);

export const getLocationHazardEffectsOfType = <
	M extends MaybeDraft<Model>,
	T extends LocationHazardEffectType
>(
	model: M,
	locationID: LocationID,
	effectType: T
) => {
	const location = getLocation(model, locationID);
	if (!location.explorable) return undefined;
	const effects = location.hazard.effects.filter(
		({ type }) => type === effectType
	);

	if (effects.length === 0) return undefined;
	return effects as MatchReadonly<M, LocationHazardEffect<T>>[];
};
