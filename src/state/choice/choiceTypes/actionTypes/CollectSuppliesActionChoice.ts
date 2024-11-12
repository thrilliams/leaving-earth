import { SpacecraftID } from "../../../model/Spacecraft";
import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesAgencyOwnSpacecraft } from "../../../helpers/agency";
import { getLocation } from "../../../helpers/location";
import {
	doesSpacecraftExist,
	getSpacecraft,
} from "../../../helpers/spacecraft";
import type { Model } from "../../../model/Model";
import type { Immutable } from "laika-engine";

export type CollectSuppliesActionChoice = z.infer<
	ReturnType<typeof validateCollectSuppliesAction>
>;

export const validateCollectSuppliesAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("collect_supplies"),
		spacecraftID: SpacecraftID.superRefine((spacecraftID, ctx) => {
			if (!doesSpacecraftExist(model, spacecraftID))
				return ctx.addIssue({
					message: "selected spacecraft does not exist",
					code: "custom",
				});

			if (
				!doesAgencyOwnSpacecraft(model, decision.agencyID, spacecraftID)
			)
				return ctx.addIssue({
					message: "spacecraft owned by another agency",
					code: "custom",
				});

			const spacecraft = getSpacecraft(model, spacecraftID);

			if (spacecraft.years > 0)
				ctx.addIssue({
					message:
						"supplies cannot be collected during multi-year maneuver",
					code: "custom",
				});

			const location = getLocation(model, spacecraft.locationID);

			if (!location.explorable)
				return ctx.addIssue({
					message: "spacecraft location not explorable",
					code: "custom",
				});

			const suppliesEffect = location.hazard.effects.find(
				({ type }) => type === "supplies"
			);

			if (suppliesEffect === undefined)
				ctx.addIssue({
					message: "spacecraft location does not provide supplies",
					code: "custom",
				});
		}),
	});
