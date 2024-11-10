import type { MissionID } from "@state/model/mission/Mission";
import { getLocation } from "./location";
import { predicate, selector } from "./wrappers";

export const getMission = selector((model, missionID: MissionID) => {
	const mission = model.missions.find(({ id }) => id === missionID);
	if (mission !== undefined) return mission;
	throw new Error("failed to resolve mission ID");
});

export const getAvailableMissions = selector((model) => model.missions.slice());

export const isMissionImpossible = predicate((model, missionID: MissionID) => {
	const mission = getMission(model, missionID);

	if (
		mission.type === "lander" ||
		mission.type === "manned_mission" ||
		mission.type === "station" ||
		mission.type === "sample_return"
	) {
		// getting a man or probe/capsule to space is always possible
		if (mission.locationID === null) return false;

		// as is getting one to a location with no hazards, or unknown hazards
		const location = getLocation(model, mission.locationID);
		if (
			!location.explorable ||
			!location.revealed ||
			location.hazard === null
		)
			return false;

		// but getting one to a location that destroys spacecraft isn't
		const spacecraftDestroyedEffect = location.hazard.effects.find(
			({ type }) => type === "spacecraft_destroyed"
		);
		return spacecraftDestroyedEffect !== undefined;
	}

	if (mission.type === "reveal_location") {
		const location = getLocation(model, mission.locationID);
		if (!location.explorable) return true;
		return location.revealed;
	}

	if (mission.type === "extraterrestrial_life") {
		for (const location of Object.values(model.locations)) {
			if (!location.explorable) continue;
			if (!location.revealed) return false;
			if (location.hazard === null) continue;

			const lifeEffect = location.hazard.effects.find(
				({ type }) => type === "life"
			);
			if (lifeEffect !== undefined) return false;
		}

		return true;
	}

	throw new Error("unexpected mission type");
});
