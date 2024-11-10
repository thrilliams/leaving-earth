import { getComponent, isComponentOfType } from "@state/helpers/component";
import { getComponentDefinition } from "@state/helpers/component/definition";
import { getSpacecraft } from "@state/helpers/spacecraft";
import type { LocationID } from "@state/model/location/Location";
import type { Model } from "@state/model/Model";
import type { SpacecraftID } from "@state/model/Spacecraft";
import type { Draft } from "laika-engine";
import { destroyComponent } from "./component";
import { completeLocationMissions } from "./mission";

export const destroySpacecraft = (
	model: Draft<Model>,
	spacecraftID: SpacecraftID
) => {
	const spacecraft = getSpacecraft(model, spacecraftID);
	for (const componentID of spacecraft.componentIDs) {
		destroyComponent(model, componentID);
	}
};

export const deleteSpacecraft = (
	model: Draft<Model>,
	spacecraftID: SpacecraftID
) => {
	for (const agency of model.agencies) {
		agency.spacecraft = agency.spacecraft.filter(
			({ id }) => id !== spacecraftID
		);
	}
};

export const moveSpacecraft = (
	model: Draft<Model>,
	spacecraftID: SpacecraftID,
	locationID: LocationID,
	completeMissions: boolean
) => {
	// first, actually move spacecraft
	const spacecraft = getSpacecraft(model, spacecraftID);
	spacecraft.locationID = locationID;

	// mark each astronaut that they visited the new location
	for (const astronautID of spacecraft.componentIDs) {
		const astronaut = getComponent(model, astronautID);
		if (!isComponentOfType(model, astronaut, "astronaut")) continue;

		if (astronaut.visitedLocations === undefined)
			astronaut.visitedLocations = [];
		astronaut.visitedLocations.push(locationID);
	}

	if (completeMissions) completeLocationMissions(model, spacecraftID);
};

export const consumeSupplies = (
	model: Draft<Model>,
	spacecraftID: SpacecraftID,
	numberOfSupplies = 1
) => {
	const spacecraft = getSpacecraft(model, spacecraftID);
	for (const componentID of spacecraft.componentIDs) {
		if (numberOfSupplies <= 0) break;

		const component = getComponent(model, componentID);
		const definition = getComponentDefinition(model, component.type);
		if (definition.type === "supplies") {
			numberOfSupplies--;
			destroyComponent(model, componentID);
		}
	}

	if (numberOfSupplies > 0)
		throw new Error("failed to consume enough supplies");
};
