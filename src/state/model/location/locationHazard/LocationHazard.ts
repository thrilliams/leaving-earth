import type { LocationID } from "../Location";
import type { LocationHazardFlavor } from "./LocationHazardFlavor";

export type LocationHazardEffectType =
	| "spacecraft_destroyed"
	| "valuable_sample"
	| "supplies"
	| "sickness"
	| "solar_radiation"
	| "life"
	| "alien_sample"
	// outer planets
	| "astronaut_radiation"
	| "component_radiation"
	| "orbital_sample"
	| "damage_component";

export interface BaseLocationHazardEffect {
	type: LocationHazardEffectType;
}

export interface SpacecraftDestroyedLocationHazardEffect
	extends BaseLocationHazardEffect {
	type: "spacecraft_destroyed";
}

export interface ValuableSampleLocationHazardEffect
	extends BaseLocationHazardEffect {
	type: "valuable_sample";
	value: number;
}

export interface SuppliesLocationHazardEffect extends BaseLocationHazardEffect {
	type: "supplies";
}

export interface SicknessLocationHazardEffect extends BaseLocationHazardEffect {
	type: "sickness";
	severity: number;
}

export interface RadiationLocationHazardEffect
	extends BaseLocationHazardEffect {
	type: "solar_radiation" | "astronaut_radiation" | "component_radiation";
	severity: number;
}

export interface LifeLocationHazardEffect extends BaseLocationHazardEffect {
	type: "life";
}

export interface AlienOriginLocationHazardEffect
	extends BaseLocationHazardEffect {
	type: "alien_sample";
}

export interface OrbitalSampleHazardEffect extends BaseLocationHazardEffect {
	type: "orbital_sample";
	orbitID: LocationID;
}

export interface DamageComponentLocationHazardEffect
	extends BaseLocationHazardEffect {
	type: "damage_component";
	severity: number;
}

export type LocationHazardEffect<
	T extends LocationHazardEffectType = LocationHazardEffectType
> = (
	| SpacecraftDestroyedLocationHazardEffect
	| ValuableSampleLocationHazardEffect
	| SuppliesLocationHazardEffect
	| SicknessLocationHazardEffect
	| RadiationLocationHazardEffect
	| LifeLocationHazardEffect
	| AlienOriginLocationHazardEffect
	| OrbitalSampleHazardEffect
	| DamageComponentLocationHazardEffect
) & { type: T };

export type ExplorableMissionLetter = "alpha" | "beta" | "gamma";

export interface LocationHazard {
	flavor: LocationHazardFlavor;
	effects: LocationHazardEffect[];
	// outer planets; for explorable missions
	letters?: ExplorableMissionLetter[];
}
