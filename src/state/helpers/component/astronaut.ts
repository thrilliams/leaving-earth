import { ComponentID } from "../../model/component/Component";
import type { ComponentDefinition } from "../../model/component/ComponentDefinition";
import { getComponent, isComponentOfType } from "../component";
import { selector } from "../wrappers";
import { getComponentDefinition } from "./definition";

export const getCapsuleDefinitionOfAstronaut = selector(
	(model, astronautID: ComponentID, onlyWorking: boolean) => {
		const component = getComponent(model, astronautID);
		if (!isComponentOfType(model, component, "astronaut"))
			throw new Error("component is not astronaut");

		const capsuleID = component.capsule;
		if (capsuleID === undefined) return;

		const capsule = getComponent(model, capsuleID);
		if (onlyWorking && capsule.damaged) return;
		const definition = getComponentDefinition(model, capsule.type);
		return definition as ComponentDefinition<"capsule">;
	}
);
