import { SpacecraftID } from "../../../model/Spacecraft";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import type { Model } from "../../../model/Model";
import type { Immutable } from "laika-engine";
import { z } from "zod";
import { BaseTakeActionChoice } from "./ActionType";
import {
	doesSpacecraftExist,
	doesSpacecraftHaveAstronaut,
	doesSpacecraftHaveSupplies,
	getSpacecraft,
} from "../../../helpers/spacecraft";
import { doesAgencyOwnSpacecraft } from "../../../helpers/agency";
import { getLocation } from "../../../helpers/location";

export type RepairComponentsActionChoice = z.infer<
	ReturnType<typeof validateRepairComponentsAction>
>;

export const validateRepairComponentsAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("repair_components"),
		spacecraftID: SpacecraftID.superRefine((spacecraftID, ctx) => {
			if (!doesSpacecraftExist(model, spacecraftID))
				return ctx.addIssue({
					message: "selected spacecraft does not exist",
					code: "custom",
				});

			if (
				!doesAgencyOwnSpacecraft(model, decision.agencyID, spacecraftID)
			)
				ctx.addIssue({
					message: "selected spacecraft owned by another agency",
					code: "custom",
				});

			const spacecraft = getSpacecraft(model, spacecraftID);
			if (
				!doesSpacecraftHaveAstronaut(
					model,
					spacecraftID,
					true,
					"mechanic"
				)
			)
				ctx.addIssue({
					message: "no healthy mechanic on board",
					code: "custom",
				});

			const location = getLocation(model, spacecraft.locationID);
			if (location.noRendezvousOrRepair)
				ctx.addIssue({
					message: "repair not possible in this location",
					code: "custom",
				});

			if (!doesSpacecraftHaveSupplies(model, spacecraftID))
				ctx.addIssue({
					message: "no supplies on board",
					code: "custom",
				});
		}),
	});
