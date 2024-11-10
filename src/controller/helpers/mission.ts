import { getAgency } from "@state/helpers/agency";
import { getComponent, isComponentOfType } from "@state/helpers/component";
import { getComponentDefinition } from "@state/helpers/component/definition";
import { getAvailableMissions, getMission } from "@state/helpers/mission";
import {
	doesSpacecraftHaveWorkingProbeOrCapsule,
	getSpacecraft,
	getSpacecraftOwner,
	isSpacecraftInLocation,
} from "@state/helpers/spacecraft";
import type { AgencyID } from "@state/model/Agency";
import type { MissionID } from "@state/model/mission/Mission";
import type { Model } from "@state/model/Model";
import type { SpacecraftID } from "@state/model/Spacecraft";
import type { Draft } from "laika-engine";
import { destroyComponent } from "./component";
import { getLocation } from "@state/helpers/location";

export const completeMission = (
	model: Draft<Model>,
	agencyID: AgencyID,
	missionID: MissionID
) => {
	const mission = getMission(model, missionID);
	model.missions = model.missions.filter(({ id }) => id !== missionID);

	const agency = getAgency(model, agencyID);
	agency.missions.push(mission);

	for (const otherAgency of model.agencies) {
		if (otherAgency.id === agencyID) continue;

		otherAgency.passedThisYear = false;
		otherAgency.funds += 10;
	}
};

export const completeLocationMissions = (
	model: Draft<Model>,
	spacecraftID: SpacecraftID
) => {
	const spacecraft = getSpacecraft(model, spacecraftID);

	const agency = getSpacecraftOwner(model, spacecraftID);
	for (const mission of getAvailableMissions(model)) {
		if (
			mission.type === "lander" &&
			isSpacecraftInLocation(model, spacecraftID, mission.locationID)
		) {
			if (doesSpacecraftHaveWorkingProbeOrCapsule(model, spacecraftID))
				completeMission(model, agency.id, mission.id);
		}

		if (
			mission.type === "manned_mission" &&
			spacecraft.locationID === "earth"
		) {
			for (const astronautID of spacecraft.componentIDs) {
				const astronaut = getComponent(model, astronautID);
				if (!isComponentOfType(model, astronaut, "astronaut")) continue;

				let visistedMissionLocation = false;
				for (const locationID of astronaut.visitedLocations || []) {
					if (locationID === mission.locationID)
						visistedMissionLocation = true;

					if (locationID !== "earth" && mission.locationID === null)
						visistedMissionLocation = true;
				}

				if (!visistedMissionLocation) continue;

				completeMission(model, agency.id, mission.id);
				break;
			}
		}

		if (
			mission.type === "sample_return" &&
			spacecraft.locationID === "earth"
		) {
			for (const sampleID of spacecraft.componentIDs) {
				const sample = getComponent(model, sampleID);
				const definition = getComponentDefinition(model, sample.type);
				if (definition.type !== "sample") continue;

				if (definition.locationID !== mission.locationID) continue;

				completeMission(model, agency.id, mission.id);
				destroyComponent(model, sampleID);
				break;
			}
		}

		if (
			mission.type === "extraterrestrial_life" &&
			spacecraft.locationID === "earth"
		) {
			for (const sampleID of spacecraft.componentIDs) {
				const sample = getComponent(model, sampleID);
				const definition = getComponentDefinition(model, sample.type);
				if (definition.type !== "sample") continue;

				const sampleLocation = getLocation(
					model,
					definition.locationID
				);

				if (!sampleLocation.explorable) continue;
				if (!sampleLocation.revealed) continue;

				const lifeHazard = sampleLocation.hazard?.effects.find(
					({ type }) => type === "life"
				);
				if (lifeHazard === undefined) continue;

				completeMission(model, agency.id, mission.id);
				break;
			}
		}
	}
};
