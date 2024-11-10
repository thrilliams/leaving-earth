import type {
	ComponentDefinitionID,
	ComponentDefinitionType,
} from "../ComponentDefinition";

export interface BaseComponentDefinition {
	id: ComponentDefinitionID;
	type: ComponentDefinitionType;
}
