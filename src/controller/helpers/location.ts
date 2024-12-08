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
import { getRandomElement } from "./rng/array";

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

	// draw explorable mission, if any
	if (!location.hazard.letters) return;

	const explorableMissions = model.explorableMissions[locationID];
	if (!explorableMissions)
		throw new Error("no explorable missions for location with ");

	const matchingMissions = explorableMissions.filter(({ letters }) => {
		if (!letters) return false;
		for (const letter of letters)
			if (location.hazard.letters?.includes(letter)) return true;
		return false;
	});

	const drawnMission = getRandomElement(model, matchingMissions);
	if (drawnMission) {
		model.missions.push(drawnMission);
		logger(`after`)`${["agency", agencyID]} drew ${[
			"mission",
			drawnMission.id,
		]} and added it to the available missions`;
	}
}
