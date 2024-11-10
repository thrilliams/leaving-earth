import type { LocationHazardFlavor } from "./LocationHazardFlavor";

export type LocationHazardEffectType =
	| "spacecraft_destroyed"
	| "valuable_sample"
	| "supplies"
	| "sickness"
	| "radiation"
	| "life"
	| "alien_sample";

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
	type: "radiation";
	severity: number;
}

export interface LifeLocationHazardEffect extends BaseLocationHazardEffect {
	type: "life";
}

export interface AlienOriginLocationHazardEffect
	extends BaseLocationHazardEffect {
	type: "alien_sample";
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
) & { type: T };

export interface LocationHazard {
	flavor: LocationHazardFlavor;
	effects: LocationHazardEffect[];
}
