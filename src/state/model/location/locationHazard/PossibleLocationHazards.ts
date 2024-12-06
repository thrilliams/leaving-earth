import type { ExplorableLocationID } from "../Location";
import { type LocationHazard } from "./LocationHazard";

export const PossibleLocationHazards: Record<
	ExplorableLocationID,
	LocationHazard[]
> = {
	solar_radiation: [
		{ flavor: "none", effects: [] },
		{ flavor: "radiation", effects: [{ type: "radiation", severity: 1 }] },
		{ flavor: "radiation", effects: [{ type: "radiation", severity: 2 }] },
	],
	suborbital_flight: [
		{ flavor: "none", effects: [] },
		{ flavor: "none", effects: [] },
		{
			flavor: "sickness",
			effects: [{ type: "sickness", severity: 1 }],
		},
		{
			flavor: "sickness",
			effects: [{ type: "sickness", severity: 3 }],
		},
	],
	moon: [
		{ flavor: "none", effects: [] },
		{
			flavor: "dust_oceans",
			effects: [{ type: "spacecraft_destroyed" }],
		},
		{
			flavor: "valuable_minerals",
			effects: [{ type: "valuable_sample", value: 25 }],
		},
		{
			flavor: "regolith_microbes",
			effects: [{ type: "life" }],
		},
	],
	phobos: [
		{ flavor: "none", effects: [] },
		{ flavor: "none", effects: [] },
		{
			flavor: "hollow",
			effects: [{ type: "alien_sample" }],
		},
	],
	mars: [
		{ flavor: "none", effects: [] },
		{
			flavor: "valuable_minerals",
			effects: [{ type: "valuable_sample", value: 50 }],
		},
		{
			flavor: "seasonal_plant_life",
			effects: [{ type: "life" }, { type: "supplies" }],
		},
	],
	venus: [
		{
			flavor: "extreme_heat_and_pressure",
			effects: [{ type: "spacecraft_destroyed" }],
		},
		{
			flavor: "extreme_heat_and_pressure",
			effects: [{ type: "spacecraft_destroyed" }],
		},
		{
			flavor: "liquid_water_oceans",
			effects: [{ type: "supplies" }],
		},
		{
			flavor: "wetland_life",
			effects: [{ type: "life" }, { type: "supplies" }],
		},
	],
	ceres: [
		{ flavor: "none", effects: [] },
		{
			flavor: "water_ice",
			effects: [{ type: "supplies" }],
		},
		{
			flavor: "valuable_minerals",
			effects: [{ type: "valuable_sample", value: 50 }],
		},
	],
	mercury: [
		{ flavor: "none", effects: [] },
		{
			flavor: "valuable_minerals",
			effects: [{ type: "valuable_sample", value: 50 }],
		},
	],
};
