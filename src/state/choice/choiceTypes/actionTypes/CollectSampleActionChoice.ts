import { SpacecraftID } from "../../../model/Spacecraft";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesAgencyOwnSpacecraft } from "../../../helpers/agency";
import { doesLocationHaveSample } from "../../../helpers/location";
import { doesSpacecraftExist, getSpacecraft } from "../../../helpers/spacecraft";
import type { Model } from "../../../model/Model";
import type { Immutable } from "laika-engine";
import { z } from "zod";
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
				code: "custom",
			});

		const spacecraft = getSpacecraft(model, choice.spacecraftID);
		if (!doesLocationHaveSample(model, spacecraft.locationID))
			ctx.addIssue({
				message: "samples cannot be collected from spacecraft location",
				code: "custom",
			});
	});
