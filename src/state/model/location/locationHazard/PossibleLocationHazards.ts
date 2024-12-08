import type { ExplorableLocationID } from "../Location";
import { type LocationHazard } from "./LocationHazard";

export const PossibleLocationHazards: Record<
	ExplorableLocationID,
	LocationHazard[]
> = {
	solar_radiation: [
		{ flavor: "none", effects: [] },
		{
			flavor: "none",
			effects: [{ type: "solar_radiation", severity: 1 }],
		},
		{
			flavor: "none",
			effects: [{ type: "solar_radiation", severity: 2 }],
		},
	],
	suborbital_flight: [
		{ flavor: "none", effects: [] },
		{ flavor: "none", effects: [] },
		{ flavor: "none", effects: [{ type: "sickness", severity: 1 }] },
		{ flavor: "none", effects: [{ type: "sickness", severity: 3 }] },
	],
	moon: [
		{ flavor: "none", effects: [] },
		{ flavor: "dust_oceans", effects: [{ type: "spacecraft_destroyed" }] },
		{ flavor: "none", effects: [{ type: "valuable_sample", value: 25 }] },
		{ flavor: "regolith_microbes", effects: [{ type: "life" }] },
	],
	phobos: [
		{ flavor: "none", effects: [] },
		{ flavor: "none", effects: [] },
		{ flavor: "hollow", effects: [{ type: "alien_sample" }] },
	],
	mars: [
		{ flavor: "none", effects: [] },
		{ flavor: "none", effects: [{ type: "valuable_sample", value: 50 }] },
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
		{ flavor: "liquid_water_oceans", effects: [{ type: "supplies" }] },
		{
			flavor: "wetland_life",
			effects: [{ type: "life" }, { type: "supplies" }],
		},
	],
	ceres: [
		{ flavor: "none", effects: [] },
		{ flavor: "water_ice", effects: [{ type: "supplies" }] },
		{ flavor: "none", effects: [{ type: "valuable_sample", value: 50 }] },
	],

	// mercury mini-expansion
	mercury: [
		{ flavor: "none", effects: [] },
		{ flavor: "none", effects: [{ type: "valuable_sample", value: 50 }] },
	],

	// outer planets
	io: [
		{ flavor: "none", effects: [] },
		{ flavor: "volcanic_activity", effects: [], letters: ["alpha"] },
		{
			flavor: "none",
			effects: [{ type: "valuable_sample", value: 75 }],
			letters: ["alpha"],
		},
	],
	europa: [
		{ flavor: "thick_ice", effects: [], letters: ["alpha"] },
		{ flavor: "thin_ice", effects: [], letters: ["beta"] },
		{
			flavor: "aquatic_life_thin_ice",
			effects: [{ type: "life" }],
			letters: ["beta"],
		},
		{
			flavor: "unknown_force",
			effects: [{ type: "spacecraft_destroyed" }],
			letters: ["gamma"],
		},
	],
	ganymede: [
		{ flavor: "none", effects: [] },
		{ flavor: "rock_and_ice_crust", effects: [], letters: ["alpha"] },
		{
			flavor: "none",
			effects: [{ type: "valuable_sample", value: 50 }],
			letters: ["alpha"],
		},
	],
	callisto: [
		{ flavor: "none", effects: [] },
		{ flavor: "none", effects: [] },
		{
			flavor: "none",
			effects: [{ type: "valuable_sample", value: 25 }],
			letters: ["alpha"],
		},
	],
	jupiter: [
		{
			flavor: "none",
			effects: [
				{ type: "astronaut_radiation", severity: 6 },
				{ type: "component_radiation", severity: 4 },
			],
			letters: ["alpha"],
		},
		{
			flavor: "none",
			effects: [
				{ type: "astronaut_radiation", severity: 3 },
				{ type: "component_radiation", severity: 1 },
			],
			letters: ["beta"],
		},
		{
			flavor: "none",
			effects: [{ type: "astronaut_radiation", severity: 1 }],
			letters: ["beta"],
		},
	],
	enceladus: [
		{
			flavor: "geysers",
			effects: [{ type: "orbital_sample", orbitID: "saturn_orbit" }],
			letters: ["alpha"],
		},
		{
			flavor: "aquatic_life_thin_ice",
			effects: [{ type: "life" }],
			letters: ["beta"],
		},
		{ flavor: "thin_ice", effects: [], letters: ["alpha", "beta"] },
	],
	titan: [
		{
			flavor: "nitrogen_methane_atmosphere",
			effects: [],
			letters: ["alpha"],
		},
		{
			flavor: "liquid_hydrocarbons",
			effects: [{ type: "supplies" }],
			letters: ["alpha"],
		},
		{
			flavor: "methane_based_life",
			effects: [{ type: "life" }],
			letters: ["beta"],
		},
	],
	saturn: [
		{
			flavor: "debris_from_rings",
			effects: [{ type: "damage_component", severity: 2 }],
			letters: ["alpha"],
		},
		{ flavor: "none", effects: [], letters: ["beta"] },
		{
			flavor: "none",
			effects: [{ type: "astronaut_radiation", severity: 2 }],
			letters: ["beta"],
		},
	],
	uranus: [{ flavor: "none", effects: [] }],
	neptune: [{ flavor: "none", effects: [] }],
};
