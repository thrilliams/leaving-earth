import type { ManeuverID, MissionID } from "../../model";
import type { AdvancementID } from "../model/advancement/Advancement";
import type { Outcome } from "../model/advancement/Outcome";
import type { AgencyID } from "../model/Agency";
import type { ComponentID } from "../model/component/Component";
import type { LocationID } from "../model/location/Location";
import type { SpacecraftID } from "../model/Spacecraft";

export type LogObjectContext =
	// literals
	| ["number", number]
	| ["string", string]
	// game references
	| ["agency", AgencyID]
	| ["spacecraft", SpacecraftID]
	| ["component", ComponentID]
	| ["location", LocationID]
	| ["outcome", Outcome]
	| ["advancement", AdvancementID]
	// also requires profile index
	| ["maneuver", ManeuverID, number]
	| ["mission", MissionID];
