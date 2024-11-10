import { getComponentDefinition } from "@state/helpers/component/definition";
import type { ComponentID } from "@state/model/component/Component";
import type { Model } from "@state/model/Model";
import type { Draft } from "laika-engine";

export const destroyComponent = (
	model: Draft<Model>,
	componentID: ComponentID,
	killAstronauts = true
) => {
	for (const agency of model.agencies) {
		if (killAstronauts) {
			for (const component of agency.components) {
				if (component.id !== componentID) continue;
				const definition = getComponentDefinition(
					model,
					component.type
				);
				if (definition.type === "astronaut")
					agency.deadAstronauts.push(component);
			}
		}

		agency.components = agency.components.filter(
			({ id }) => id !== componentID
		);

		for (const spacecraft of agency.spacecraft) {
			spacecraft.componentIDs = spacecraft.componentIDs.filter(
				(id) => id !== componentID
			);
		}
	}

	cleanUpEmptySpacecraft(model);
};

export const cleanUpEmptySpacecraft = (model: Draft<Model>) => {
	for (const agency of model.agencies) {
		agency.spacecraft = agency.spacecraft.filter(
			({ componentIDs }) => componentIDs.length > 0
		);
	}
};
