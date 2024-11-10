import { ComponentDefinitionID } from "@state/model/component/ComponentDefinition";
import { selector } from "../wrappers";
import { LocationID } from "@state/model/location/Location";

/**
 * returns the component definition with the given ID, or errors if none exists
 */
export const getComponentDefinition = selector(
	(model, componentDefinitionID: ComponentDefinitionID) => {
		const definition = model.componentDefinitions[componentDefinitionID];
		if (definition !== undefined) return definition;
		throw new Error("definition type could not be resolved");
	}
);

export const getSampleDefinitionOfLocation = selector(
	(model, locationID: LocationID) => {
		for (const definition of Object.values(model.componentDefinitions)) {
			if (definition.type !== "sample") continue;
			if (definition.locationID === locationID) return definition;
		}

		throw new Error("could not find resolve locationID");
	}
);
