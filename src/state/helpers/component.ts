import { ComponentID, type Component } from "../model/component/Component";
import type { ComponentDefinitionType } from "../model/component/ComponentDefinition";
import type { Model } from "../model/Model";
import type { MaybeDraft } from "laika-engine";
import { getComponentDefinition } from "./component/definition";
import { predicate, selector } from "./wrappers";

/**
 * returns true if a component with the given ID exists, or false otherwise
 */
export const doesComponentExist = predicate(
	(model, componentID: ComponentID) => {
		for (const agency of Object.values(model.agencies)) {
			const component = agency.components.find(
				(component) => component.id === componentID
			);
			if (component !== undefined) return true;
		}

		return false;
	}
);

/**
 * returns the component with the given ID, or errors if none exists
 */
export const getComponent = selector((model, componentID: ComponentID) => {
	for (const agency of model.agencies) {
		const component = agency.components.find(
			(component) => component.id === componentID
		);
		if (component !== undefined) return component;
	}

	throw new Error("component ID could not be resolved");
});

export const getAllComponents = selector((model) => {
	const components: Component[] = [];
	for (const agency of model.agencies) {
		components.push(...agency.components);
	}

	return components;
});

export const getComponentOwner = selector((model, componentID: ComponentID) => {
	for (const agency of model.agencies) {
		for (const component of agency.components) {
			if (component.id === componentID) return agency;
		}
	}

	throw new Error("component ID could not be resolved");
});

/**
 * returns true if the component with the given ID is damaged
 */
export const isComponentDamaged = predicate(
	(model, componentID: ComponentID) => {
		const component = getComponent(model, componentID);
		return component.damaged;
	}
);

export const isComponentOfType = <
	M extends MaybeDraft<Model>,
	T extends ComponentDefinitionType
>(
	model: M,
	component: Component,
	type: T
): component is Component<T> => {
	const definition = getComponentDefinition(model, component.type);
	return definition.type === type;
};
