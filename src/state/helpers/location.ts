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

		const location = getLocation(model, locationID);
		for (const maneuver of location.maneuvers) {
			if (maneuver.hazards.radiation !== undefined)
				surveyableLocations.add("solar_radiation");

			if (maneuver.hazards.location === undefined) continue;
			const location = getLocation(
				model,
				maneuver.hazards.location.locationID
			);
			if (location.explorable && !location.astronautOnly)
				surveyableLocations.add(maneuver.hazards.location.locationID);
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
