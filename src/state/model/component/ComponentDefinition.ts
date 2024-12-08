import type { MaybeDraft } from "laika-engine";
import type { ExpansionID } from "../../expansion/ExpansionID";
import type { AstronautComponentDefinition } from "./componentDefinition/AstronautComponentDefinition";
import type { CapsuleComponentDefinition } from "./componentDefinition/CapsuleComponentDefinition";
import type { IonThrusterComponentDefinition } from "./componentDefinition/IonThrusterComponentDefinition";
import type { ProbeComponentDefinition } from "./componentDefinition/ProbeComponentDefinition";
import type { RocketComponentDefinition } from "./componentDefinition/RocketComponentDefinition";
import type { SampleComponentDefinition } from "./componentDefinition/SampleComponentDefinition";
import type { SuppliesComponentDefinition } from "./componentDefinition/SuppliesComponentDefinition";

import { z } from "zod";
import type { ExplorerComponentDefinition } from "./componentDefinition/ExplorerComponentDefinition";

const baseGameComponentDefinitionIDs = [
	"juno_rocket",
	"atlas_rocket",
	"soyuz_rocket",
	"saturn_rocket",

	"ion_thruster",

	"probe",

	"vostok_capsule",
	"apollo_capsule",
	"eagle_capsule",
	"aldrin_capsule",

	"supplies",

	"ceres_sample",
	"mars_sample",
	"moon_sample",
	"phobos_sample",
	"venus_sample",

	"mechanic_astronaut",
	"doctor_astronaut",
	"pilot_astronaut",
] as const;

const mercuryComponentDefinitionIDs = ["mercury_sample"] as const;

const outerPlanetsComponentDefinitionIDs = [
	"proton_rocket",

	"explorer_payload",
	"galileo_probe",

	"ganymede_sample",
	"io_sample",
	"callisto_sample",
	"europa_sample",
	"enceladus_sample",
	"saturn_sample",

	"scientist_astronaut",
] as const;

export const ComponentDefinitionID = (expansions: MaybeDraft<ExpansionID[]>) =>
	z
		.enum([
			...baseGameComponentDefinitionIDs,
			...mercuryComponentDefinitionIDs,
			...outerPlanetsComponentDefinitionIDs,
		])
		.refine((componentDefinitionID) => {
			if (
				baseGameComponentDefinitionIDs.includes(
					componentDefinitionID as (typeof baseGameComponentDefinitionIDs)[number]
				)
			)
				return true;

			if (
				mercuryComponentDefinitionIDs.includes(
					componentDefinitionID as (typeof mercuryComponentDefinitionIDs)[number]
				)
			)
				return expansions.includes("mercury");

			if (
				outerPlanetsComponentDefinitionIDs.includes(
					componentDefinitionID as (typeof outerPlanetsComponentDefinitionIDs)[number]
				)
			)
				return expansions.includes("outer_planets");
		});

export type ComponentDefinitionID = z.infer<
	ReturnType<typeof ComponentDefinitionID>
>;

export type ComponentDefinitionType =
	| "rocket"
	| "ion_thruster"
	| "probe"
	| "capsule"
	| "supplies"
	| "sample"
	| "astronaut"
	// outer planets
	| "explorer";

export type ComponentDefinition<
	T extends ComponentDefinitionType = ComponentDefinitionType
> = (
	| RocketComponentDefinition
	| IonThrusterComponentDefinition
	| ProbeComponentDefinition
	| CapsuleComponentDefinition
	| SuppliesComponentDefinition
	| SampleComponentDefinition
	| AstronautComponentDefinition
	| ExplorerComponentDefinition
) & { type: T };

export type ComponentDefinitionTypeOfID<ID> = (ComponentDefinition & {
	id: ID;
})["type"];

export type ComponentDefinitionIDOfType<Type extends ComponentDefinitionType> =
	ComponentDefinition<Type>["id"];
