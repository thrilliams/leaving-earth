import { z } from "zod";
import { SpacecraftID } from "../../../model/Spacecraft";
import { BaseTakeActionChoice } from "./ActionType";
import type { Immutable } from "laika-engine";
import type { Model } from "../../../model/Model";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesAgencyHaveAdvancement } from "../../../helpers/advancement";
import { doesSpacecraftExist, getSpacecraft } from "../../../helpers/spacecraft";
import { doesAgencyOwnSpacecraft } from "../../../helpers/agency";
import { getLocation } from "../../../helpers/location";

export type DockSpacecraftActionChoice = z.infer<
	ReturnType<typeof validateDockSpacecraftAction>
>;

export const validateDockSpacecraftAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("dock_spacecraft"),
		firstSpacecraftID: SpacecraftID,
		secondSpacecraftID: SpacecraftID,
	}).superRefine((choice, ctx) => {
		if (!doesAgencyHaveAdvancement(model, decision.agencyID, "rendezvous"))
			ctx.addIssue({
				message: "rendezvous not researched",
				code: "custom",
			});

		const firstSpacecraftExists = doesSpacecraftExist(
			model,
			choice.firstSpacecraftID
		);
		if (!firstSpacecraftExists)
			ctx.addIssue({
				message: "selected spacecraft does not exist",
				path: ["firstSpacecraftID"],
				code: "custom",
			});

		const secondSpacecraftExists = doesSpacecraftExist(
			model,
			choice.secondSpacecraftID
		);
		if (!secondSpacecraftExists)
			ctx.addIssue({
				message: "selected spacecraft does not exist",
				path: ["secondSpacecraftID"],
				code: "custom",
			});

		if (!firstSpacecraftExists || !secondSpacecraftExists) return;

		if (
			!doesAgencyOwnSpacecraft(
				model,
				decision.agencyID,
				choice.firstSpacecraftID
			)
		)
			ctx.addIssue({
				message: "selected spacecraft owned by another agency",
				path: ["firstSpacecraftID"],
				code: "custom",
			});

		if (
			!doesAgencyOwnSpacecraft(
				model,
				decision.agencyID,
				choice.secondSpacecraftID
			)
		)
			ctx.addIssue({
				message: "selected spacecraft owned by another agency",
				path: ["secondSpacecraftID"],
				code: "custom",
			});

		const firstSpacecraft = getSpacecraft(model, choice.firstSpacecraftID);
		const secondSpacecraft = getSpacecraft(
			model,
			choice.secondSpacecraftID
		);

		if (firstSpacecraft.locationID !== secondSpacecraft.locationID)
			ctx.addIssue({
				message: "selected spacecraft do not share a location",
				code: "custom",
			});

		const location = getLocation(model, firstSpacecraft.locationID);
		if (location.noRendezvousOrRepair)
			ctx.addIssue({
				message: "docking not possible in this location",
				code: "custom",
			});

		if (firstSpacecraft.years > 0)
			ctx.addIssue({
				message: "docking not possible during multi-year maneuver",
				path: ["firstSpacecraftID"],
				code: "custom",
			});

		if (secondSpacecraft.years > 0)
			ctx.addIssue({
				message: "docking not possible during multi-year maneuver",
				path: ["secondSpacecraftID"],
				code: "custom",
			});
	});
