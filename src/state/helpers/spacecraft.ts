import { SpacecraftID } from "@state/model/Spacecraft";
import { predicate, selector } from "./wrappers";
import { getComponent, isComponentOfType } from "./component";
import { getComponentDefinition } from "./component/definition";
import { ComponentID } from "@state/model/component/Component";
import type { AstronautSpeciality } from "@state/model/component/componentDefinition/AstronautComponentDefinition";
import { LocationID } from "@state/model/location/Location";

/**
 * returns true if the spacecraft with the given ID exists, or false otherwise.
 */
export const doesSpacecraftExist = predicate(
	(model, spacecraftID: SpacecraftID) => {
		for (const agency of model.agencies) {
			const spacecraft = agency.spacecraft.find(
				({ id }) => id === spacecraftID
			);
			if (spacecraft) return true;
		}

		return false;
	}
);

/**
 * returns the spacecraft with the given ID, or errors if none exists
 */
export const getSpacecraft = selector((model, spacecraftID: SpacecraftID) => {
	for (const agency of model.agencies) {
		const spacecraft = agency.spacecraft.find(
			({ id }) => id === spacecraftID
		);
		if (spacecraft) return spacecraft;
	}

	throw new Error("spacecraft ID could not be resolved");
});

export const getAllSpacecraft = selector((model) => {
	const spacecraft = [];
	for (const agency of model.agencies) {
		spacecraft.push(...agency.spacecraft);
	}

	return spacecraft;
});

export const getAllSpacecraftIDs = selector((model) =>
	getAllSpacecraft(model).map(({ id }) => id)
);

export const getSpacecraftMass = predicate(
	(model, spacecraftID: SpacecraftID) => {
		const spacecraft = getSpacecraft(model, spacecraftID);

		let totalMass = 0;
		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			const definition = getComponentDefinition(model, component.type);
			if ("mass" in definition) totalMass += definition.mass;
		}

		return totalMass;
	}
);

export const getTotalThrustOfRockets = predicate(
	(model, rocketIDs: ComponentID[], duration: number) => {
		let totalThrust = 0;
		for (const componentID of rocketIDs) {
			const component = getComponent(model, componentID);
			const definition = getComponentDefinition(model, component.type);
			if (definition.type === "rocket") {
				totalThrust += definition.thrust;
			} else if (definition.type === "ion_thruster") {
				totalThrust += definition.thrustPerYear * duration;
			} else {
				throw new Error(
					"provided component is not a rocket or an ion thruster"
				);
			}
		}

		return totalThrust;
	}
);

export const doesSpacecraftHaveWorkingProbeOrCapsule = predicate(
	(model, spacecraftID: SpacecraftID) => {
		const spacecraft = getSpacecraft(model, spacecraftID);
		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			if (component.damaged) continue;

			const definition = getComponentDefinition(model, component.type);
			if (definition.type === "probe" || definition.type === "capsule")
				return true;
		}

		return false;
	}
);

export const doesSpacecraftHaveAstronaut = predicate(
	(
		model,
		spacecraftID: SpacecraftID,
		healthy?: boolean,
		specialty?: AstronautSpeciality
	) => {
		const spacecraft = getSpacecraft(model, spacecraftID);
		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);

			if (healthy !== undefined) {
				if (component.damaged === healthy) continue;
			}

			const defintion = getComponentDefinition(model, component.type);
			if (defintion.type !== "astronaut") continue;

			if (specialty) {
				if (defintion.speciality === specialty) return true;
			} else {
				return true;
			}
		}

		return false;
	}
);

export const doesSpacecraftHaveSupplies = predicate(
	(model, spacecraftID: SpacecraftID, amount = 1) => {
		const spacecraft = getSpacecraft(model, spacecraftID);
		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			const defintion = getComponentDefinition(model, component.type);
			if (defintion.type === "supplies") amount--;
		}

		return amount > 0;
	}
);

export const getSpacecraftOwner = selector(
	(model, spacecraftID: SpacecraftID) => {
		for (const agency of model.agencies) {
			for (const spacecraft of agency.spacecraft) {
				if (spacecraft.id === spacecraftID) return agency;
			}
		}

		throw new Error("unable to resolve spacecraft ID");
	}
);

export const isSpacecraftInLocation = predicate(
	(model, spacecraftID: SpacecraftID, locationID: LocationID | null) => {
		const spacecraft = getSpacecraft(model, spacecraftID);
		if (locationID === null) return spacecraft.locationID !== "earth";
		return spacecraft.locationID === locationID;
	}
);

export const getSpacecraftOfComponent = selector(
	(model, componentID: ComponentID) => {
		for (const agency of model.agencies) {
			const spacecraft = agency.spacecraft.find(({ componentIDs }) =>
				componentIDs.includes(componentID)
			);
			if (spacecraft) return spacecraft;
		}

		throw new Error("component not on spacecraft");
	}
);

export const getNumberOfSuppliesOnSpacecraft = predicate(
	(model, spacecraftID: SpacecraftID) => {
		const spacecraft = getSpacecraft(model, spacecraftID);

		let numberOfSupplies = 0;
		for (const componentID of spacecraft.componentIDs) {
			const component = getComponent(model, componentID);
			if (isComponentOfType(model, component, "supplies"))
				numberOfSupplies++;
		}

		return numberOfSupplies;
	}
);

export const isComponentOnSpacecraft = predicate(
	(model, componentID: ComponentID) => {
		for (const agency of model.agencies) {
			const spacecraft = agency.spacecraft.find(({ componentIDs }) =>
				componentIDs.includes(componentID)
			);
			if (spacecraft !== undefined) return true;
		}

		return false;
	}
);

export const isComponentOnEarth = predicate(
	(model, componentID: ComponentID) => {
		if (!isComponentOnSpacecraft(model, componentID)) return true;
		const spacecraft = getSpacecraftOfComponent(model, componentID);
		return spacecraft.locationID === "earth";
	}
);
