import { getLocation } from "../../state/helpers/location";
import {
	getAvailableMissions,
	isMissionImpossible,
} from "../../state/helpers/mission";
import type { AgencyID } from "../../state/model/Agency";
import type { LocationID } from "../../state/model/location/Location";
import type { Model } from "../../state/model/Model";
import type { Draft, Logger } from "laika-engine";
import { completeMission } from "./mission";
import type { Game } from "../../game";

export function revealLocation(
	model: Draft<Model>,
	logger: Logger<Game>,
	locationID: LocationID,
	agencyID: AgencyID
) {
	const location = getLocation(model, locationID);
	if (!location.explorable) throw new Error("location not explorable");
	if (location.revealed) throw new Error("location already explored");
	location.revealed = true;

	logger("after")`${["agency", agencyID]} revealed the location hazard on ${[
		"location",
		locationID,
	]}`;

	// remove impossible missions
	model.missions = model.missions.filter(
		(mission) => !isMissionImpossible(model, mission.id)
	);

	for (const mission of getAvailableMissions(model)) {
		if (mission.type === "reveal_location") {
			if (mission.locationID !== locationID) continue;
			completeMission(model, logger, agencyID, mission.id);
		}

		if (mission.type === "reveal_multiple_locations") {
			if (!mission.locationIDs.includes(locationID)) continue;

			let allRevealed = true;
			for (const id of mission.locationIDs) {
				const location = getLocation(model, id);
				if (location.explorable && !location.revealed)
					allRevealed = false;
			}

			if (allRevealed)
				completeMission(model, logger, agencyID, mission.id);
		}
	}
}
