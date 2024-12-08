import type { Model } from "../../model";
import { endOfTurnToLost } from "./endOfYearToLost";

export function addMercuryContent(model: Model) {
	// update base game locations
	model.locations.inner_transfer!.maneuvers.push({
		destinationID: "mercury_fly_by",
		profiles: [
			{
				difficulty: 5,
				hazards: [
					{ type: "location", locationID: "solar_radiation" },
					{ type: "duration", years: 1 },
				],
			},
		],
	});

	// add new locations
	model.locations.mercury_fly_by = {
		id: "mercury_fly_by",
		maneuvers: [
			{
				destinationID: "mercury_orbit",
				profiles: [
					{
						difficulty: 2,
						hazards: [{ type: "duration", years: 0 }],
					},
				],
			},
			{
				destinationID: "mercury",
				profiles: [
					{
						difficulty: 4,
						hazards: [
							{ type: "landing", optional: false },
							{ type: "location", locationID: "mercury" },
						],
					},
				],
			},
			endOfTurnToLost(),
		],
		explorable: false,
	};

	model.locations.mercury_orbit = {
		id: "mercury_orbit",
		maneuvers: [
			{
				destinationID: "inner_transfer",
				profiles: [
					{
						difficulty: 7,
						hazards: [
							{ type: "location", locationID: "solar_radiation" },
							{ type: "duration", years: 1 },
						],
					},
				],
			},
			{
				destinationID: "mercury",
				profiles: [
					{
						difficulty: 2,
						hazards: [
							{ type: "landing", optional: false },
							{ type: "location", locationID: "mercury" },
						],
					},
				],
			},
		],
		explorable: false,
	};

	model.locations.mercury = {
		id: "mercury",
		maneuvers: [
			{
				destinationID: "mercury_orbit",
				profiles: [
					{
						difficulty: 2,
						hazards: [],
					},
				],
			},
		],
		explorable: true,
		hazard: { flavor: "none", effects: [] },
		revealed: false,
	};

	// add new components
	model.componentDefinitions.mercury_sample = {
		id: "mercury_sample",
		type: "sample",
		mass: 1,
		locationID: "mercury",
	};
}
