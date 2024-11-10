import type { Prettify } from "laika-engine/src/Prettify";
import { GenericID } from "../GenericID";
import type { LocationID } from "../location/Location";
import type {
	ComponentDefinitionIDOfType,
	ComponentDefinitionType,
} from "./ComponentDefinition";

export const ComponentID = GenericID;
export type ComponentID = GenericID;

export type Component<
	T extends ComponentDefinitionType = ComponentDefinitionType
> = Prettify<
	{
		id: ComponentID;
		type: ComponentDefinitionIDOfType<T>;
		// incapacitated for astronauts
		damaged: boolean;
	} & (T extends "ion_thruster"
		? {
				// true if ion thrusters have already been used
				firedThisYear?: boolean;
		  }
		: unknown) &
		(T extends "astronaut"
			? {
					// used for reentry and solar radiation
					capsule?: ComponentID;
					// used for manned exploration missions
					visitedLocations?: LocationID[];
			  }
			: unknown)
>;
