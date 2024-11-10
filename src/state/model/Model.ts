import type { AdvancementID } from "./advancement/Advancement";
import type { AdvancementDefinition } from "./advancement/AdvancementDefinition";
import type { Agency } from "./Agency";
import type {
	ComponentDefinition,
	ComponentDefinitionID,
} from "./component/ComponentDefinition";
import type { GenericID } from "./GenericID";
import type { Location, LocationID } from "./location/Location";
import type { Mission } from "./mission/Mission";

export interface Model {
	locations: Record<LocationID, Location>;

	advancementDefinitions: Record<AdvancementID, AdvancementDefinition>;
	componentDefinitions: Record<ComponentDefinitionID, ComponentDefinition>;

	year: number;
	endYear: number;
	missions: Mission[];
	agencies: Agency[];

	// internal values; these do not correspond to any tangible state of the game
	nextID: GenericID;
	rngState: number[];
}
