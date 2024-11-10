import { SpacecraftID } from "@state/model/Spacecraft";
import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";
import { LocationID } from "@state/model/location/Location";
import type { Immutable } from "laika-engine";
import type { Model } from "@state/model/Model";
import type { TakeActionDecision } from "@state/decision/decisionTypes/TakeActionDecision";
import { doesAgencyHaveAdvancement } from "@state/helpers/advancement";
import { doesAgencyOwnSpacecraft } from "@state/helpers/agency";
import {
	doesSpacecraftExist,
	doesSpacecraftHaveWorkingProbeOrCapsule,
	getSpacecraft,
} from "@state/helpers/spacecraft";
import { getLocation, getSurveyableLocations } from "@state/helpers/location";

export type SurveyLocationActionChoice = z.infer<
	ReturnType<typeof validateSurveyLocationAction>
>;

export const validateSurveyLocationAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("survey_location"),
		spacecraftID: SpacecraftID,
		locationID: LocationID,
	}).superRefine((choice, ctx) => {
		if (!doesAgencyHaveAdvancement(model, decision.agencyID, "surveying"))
			ctx.addIssue({
				message: "surveying not researched",
				code: "custom",
			});

		if (!doesSpacecraftExist(model, choice.spacecraftID))
			return ctx.addIssue({
				message: "selected spacecraft does not exist",
				path: ["spacecraftID"],
				code: "custom",
			});

		if (
			!doesAgencyOwnSpacecraft(
				model,
				decision.agencyID,
				choice.spacecraftID
			)
		)
			ctx.addIssue({
				message: "selected spacecraft owned by another agency",
				path: ["spacecraftID"],
				code: "custom",
			});

		if (
			!doesSpacecraftHaveWorkingProbeOrCapsule(model, choice.spacecraftID)
		)
			ctx.addIssue({
				message: "spacecraft missing working probe or capsule",
				path: ["spacecraftID"],
				code: "custom",
			});

		const spacecraft = getSpacecraft(model, choice.spacecraftID);
		if (spacecraft.years > 0)
			ctx.addIssue({
				message: "surveying not possible during multi-year maneuver",
				path: ["spacecraftID"],
				code: "custom",
			});

		if (
			!getSurveyableLocations(model, spacecraft.locationID).includes(
				choice.locationID
			)
		)
			ctx.addIssue({
				message: "selected location not accessible by spacecraft",
				path: ["locationID"],
				code: "custom",
			});

		const target = getLocation(model, choice.locationID);
		if (!target.explorable)
			return ctx.addIssue({
				message: "location cannot be explored or surveyed",
				path: ["locationID"],
				code: "custom",
			});

		if (target.astronautOnly)
			ctx.addIssue({
				message: "location can only be explored by astronauts",
				path: ["locationID"],
				code: "custom",
			});
	});
