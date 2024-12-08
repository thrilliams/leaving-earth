import type { Immutable } from "laika-engine";
import { z } from "zod";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesAgencyOwnSpacecraft } from "../../../helpers/agency";
import {
	doesLocationHaveSample,
	getLocationHazardEffectsOfType,
} from "../../../helpers/location";
import {
	doesSpacecraftExist,
	getSpacecraft,
} from "../../../helpers/spacecraft";
import { LocationID } from "../../../model/location/Location";
import type { Model } from "../../../model/Model";
import { SpacecraftID } from "../../../model/Spacecraft";
import { BaseTakeActionChoice } from "./ActionType";

export type CollectSampleActionChoice = z.infer<
	ReturnType<typeof validateCollectSampleAction>
>;

export const validateCollectSampleAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("collect_sample"),
		spacecraftID: SpacecraftID,
		locationID: LocationID(model.expansions).optional(),
	}).superRefine((choice, ctx) => {
		if (!doesSpacecraftExist(model, choice.spacecraftID))
			return ctx.addIssue({
				message: "selected spacecraft does not exist",
				code: "custom",
			});

		if (
			!doesAgencyOwnSpacecraft(
				model,
				decision.agencyID,
				choice.spacecraftID
			)
		)
			return ctx.addIssue({
				message: "spacecraft owned by another agency",
				path: ["spacecraftID"],
				code: "custom",
			});

		const spacecraft = getSpacecraft(model, choice.spacecraftID);

		if (spacecraft.years > 0)
			ctx.addIssue({
				message:
					"samples cannot be collected during multi-year maneuver",
				path: ["spacecraftID"],
				code: "custom",
			});

		if (
			choice.locationID !== undefined &&
			choice.locationID !== spacecraft.locationID
		) {
			const orbitalSampleEffects = getLocationHazardEffectsOfType(
				model,
				choice.locationID,
				"orbital_sample"
			);

			if (!orbitalSampleEffects)
				return ctx.addIssue({
					message:
						"specified location does not have an orbital sample hazard",
					path: ["locationID"],
					code: "custom",
				});

			const matchingEffects = orbitalSampleEffects.filter(
				({ orbitID }) => orbitID === spacecraft.locationID
			);

			if (matchingEffects.length === 0)
				ctx.addIssue({
					message: "spacecraft not in orbit of location",
					path: ["spacecraft"],
					code: "custom",
				});
		} else {
			if (!doesLocationHaveSample(model, spacecraft.locationID))
				ctx.addIssue({
					message:
						"samples cannot be collected from spacecraft location",
					path: ["spacecraftID"],
					code: "custom",
				});
		}
	});
