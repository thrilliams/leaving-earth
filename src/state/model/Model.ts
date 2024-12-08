import type { ExpansionID } from "../expansion/ExpansionID";
import type { AdvancementID } from "./advancement/Advancement";
import type { AdvancementDefinition } from "./advancement/AdvancementDefinition";
import type { Agency } from "./Agency";
import type {
	ComponentDefinition,
	ComponentDefinitionID,
} from "./component/ComponentDefinition";
import type { GenericID } from "./GenericID";
import type { Location, LocationID } from "./location/Location";
import type { ManeuverWindow } from "./location/maneuver/ManeuverWindow";
import type { Mission } from "./mission/Mission";

export interface Model {
	expansions: ExpansionID[];

	locations: Partial<Record<LocationID, Location>>;

	advancementDefinitions: Partial<
		Record<AdvancementID, AdvancementDefinition>
	>;
	componentDefinitions: Partial<
		Record<ComponentDefinitionID, ComponentDefinition>
	>;

	year: number;
	endYear: number;
	maneuverWindows: Partial<Record<LocationID, ManeuverWindow>>;

	missions: Mission[];
	explorableMissions: Partial<Record<LocationID, Mission[]>>;
	agencies: Agency[];

	// internal values; these do not correspond to any tangible state of the game
	nextID: GenericID;
	rngState: number[];
}
