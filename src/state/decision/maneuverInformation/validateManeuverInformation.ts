import { doesAgencyOwnSpacecraft } from "@state/helpers/agency";
import { getManeuver, getManeuverOrigin } from "@state/helpers/maneuver";
import {
	doesSpacecraftExist,
	getSpacecraft,
	getSpacecraftMass,
	getTotalThrustOfRockets,
} from "@state/helpers/spacecraft";
import type { Model } from "@state/model/Model";
import type { Immutable } from "laika-engine";
import type { RefinementCtx } from "zod";
import type { ManeuverInformation } from "./ManeuverInformation";
import type { SpacecraftID } from "@state/model/Spacecraft";
import type { ComponentID } from "@state/model/component/Component";
import { doesComponentExist, getComponent } from "@state/helpers/component";
import { getComponentDefinition } from "@state/helpers/component/definition";

export function validateManeuverRockets(
	model: Immutable<Model>,
	spacecraftID: SpacecraftID,
	rocketIDs: ComponentID[],
	ctx: RefinementCtx
) {
	const spacecraft = getSpacecraft(model, spacecraftID);

	let allRocketsValid = true;
	for (let i = 0; i < rocketIDs.length; i++) {
		const componentID = rocketIDs[i];

		if (rocketIDs.slice(i + 1).includes(componentID))
			ctx.addIssue({
				message: "selected rocket selected multiple times",
				path: ["rocketIDs", i],
				code: "custom",
			});

		if (!spacecraft.componentIDs.includes(componentID))
			ctx.addIssue({
				message: "selected rocket not present on spacecraft",
				path: ["rocketIDs", i],
				code: "custom",
			});

		if (!doesComponentExist(model, componentID)) {
			allRocketsValid = false;
			ctx.addIssue({
				message: "selected rocket does not exist",
				path: ["rocketIDs", i],
				code: "custom",
			});

			continue;
		}

		const component = getComponent(model, componentID);
		const componentDefinition = getComponentDefinition(
			model,
			component.type
		);

		if (component.damaged)
			ctx.addIssue({
				message: "selected rocket damaged",
				path: ["rocketIDs", i],
				code: "custom",
			});

		if (
			componentDefinition.type !== "rocket" &&
			componentDefinition.type !== "ion_thruster"
		) {
			allRocketsValid = false;
			ctx.addIssue({
				message: "selected component not a rocket or an ion thruster",
				path: ["rocketIDs", i],
				code: "custom",
			});
		}
	}

	return allRocketsValid;
}

export function modifyManeuverDifficultyAndDuration(
	duration: number,
	difficulty: number,
	durationModifier: number
) {
	if (durationModifier > 0) duration += durationModifier;
	if (durationModifier < 0) {
		for (let i = durationModifier; i < 0; i++) {
			duration = Math.ceil(duration / 2);
			difficulty *= 2;
		}
	}

	return { duration, difficulty };
}

export const validateManeuverInformation = (
	model: Immutable<Model>,
	maneuverInformation: ManeuverInformation,
	ctx: RefinementCtx
) => {
	const {
		agencyID,
		spacecraftID,
		maneuverID,
		durationModifier,
		rocketIDs,
		generatedThrust,
	} = maneuverInformation;

	if (!doesAgencyOwnSpacecraft(model, agencyID, spacecraftID))
		ctx.addIssue({
			message: "spacecraft owned by another agency",
			path: ["spacecraftID"],
			code: "custom",
		});

	if (!doesSpacecraftExist(model, spacecraftID))
		return ctx.addIssue({
			message: "spacecraft does not exist",
			path: ["spacecraftID"],
			code: "custom",
		});

	const maneuver = getManeuver(model, maneuverID);
	const spacecraft = getSpacecraft(model, spacecraftID);

	if (spacecraft.years !== 0)
		ctx.addIssue({
			message: "spacecraft currently performing a multi-year maneuver",
			path: ["spacecraftID"],
			code: "custom",
		});

	if (spacecraft.locationID !== getManeuverOrigin(model, maneuverID))
		ctx.addIssue({
			message: "spacecraft not on the origin location",
			path: ["maneuverID"],
			code: "custom",
		});

	if (maneuver.duration === undefined && durationModifier !== 0)
		ctx.addIssue({
			message: "invalid duration modification",
			path: ["durationModifier"],
			code: "custom",
		});

	const allRocketsValid = validateManeuverRockets(
		model,
		spacecraftID,
		rocketIDs,
		ctx
	);

	const { difficulty, duration } = modifyManeuverDifficultyAndDuration(
		maneuver.duration || 0,
		maneuver.difficulty || 0,
		durationModifier
	);

	if (
		allRocketsValid &&
		getSpacecraftMass(model, spacecraftID) * difficulty >
			getTotalThrustOfRockets(model, rocketIDs, duration) +
				generatedThrust
	)
		ctx.addIssue({
			message: "selected rockets do not produce enough thrust",
			path: ["rocketIDs"],
			code: "custom",
		});
};
