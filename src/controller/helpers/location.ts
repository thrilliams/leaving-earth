import { getLocation } from "@state/helpers/location";
import {
	getAvailableMissions,
	isMissionImpossible,
} from "@state/helpers/mission";
import type { AgencyID } from "@state/model/Agency";
import type { LocationID } from "@state/model/location/Location";
import type { Model } from "@state/model/Model";
import type { Draft } from "laika-engine";
import { completeMission } from "./mission";

export function revealLocation(
	model: Draft<Model>,
	locationID: LocationID,
	agencyID: AgencyID
) {
	const location = getLocation(model, locationID);
	if (!location.explorable) throw new Error("location not explorable");
	if (location.revealed) throw new Error("location already explored");
	location.revealed = true;

	// remove impossible missions
	model.missions = model.missions.filter(
		(mission) => !isMissionImpossible(model, mission.id)
	);

	for (const mission of getAvailableMissions(model)) {
		if (mission.type !== "reveal_location") continue;
		if (mission.locationID !== locationID) continue;
		completeMission(model, agencyID, mission.id);
	}
}
