import { z } from "zod";
import { SpacecraftID } from "../../../model/Spacecraft";
import { ComponentID } from "../../../model/component/Component";
import { BaseTakeActionChoice } from "./ActionType";
import type { Immutable } from "laika-engine";
import type { Model } from "../../../model/Model";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { doesAgencyHaveAdvancement } from "../../../helpers/advancement";
import {
	doesSpacecraftExist,
	getSpacecraft,
} from "../../../helpers/spacecraft";
import { doesAgencyOwnSpacecraft } from "../../../helpers/agency";
import { getLocation } from "../../../helpers/location";
import { SpacecraftComponentIDs } from "./AssembleSpacecraftActionChoice";

export type SeparateSpacecraftActionChoice = z.infer<
	ReturnType<typeof validateSeparateSpacecraftAction>
>;

export const validateSeparateSpacecraftAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("separate_spacecraft"),
		spacecraftID: SpacecraftID,
		firstComponentIDs: SpacecraftComponentIDs(model),
		secondComponentIDs: SpacecraftComponentIDs(model),
	}).superRefine((choice, ctx) => {
		if (!doesAgencyHaveAdvancement(model, decision.agencyID, "rendezvous"))
			ctx.addIssue({
				message: "rendezvous not researched",
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
				message: "spacecraft owned by another agency",
				path: ["spacecraftID"],
				code: "custom",
			});

		const spacecraft = getSpacecraft(model, choice.spacecraftID);

		const location = getLocation(model, spacecraft.locationID);
		if (location.noRendezvousOrRepair)
			ctx.addIssue({
				message: "docking not possible in this location",
				path: ["spacecraftID"],
				code: "custom",
			});

		// TODO is this actually disallowed or am i making this up
		if (spacecraft.years > 0)
			ctx.addIssue({
				message: "separation not possible during multi-year maneuver",
				path: ["spacecraftID"],
				code: "custom",
			});

		// for duplicate checking
		const selectedComponents: ComponentID[] = [];

		for (let i = 0; i < choice.firstComponentIDs.length; i++) {
			const componentID = choice.firstComponentIDs[i];
			if (!spacecraft.componentIDs.includes(componentID))
				ctx.addIssue({
					message: "selected component not on spacecraft",
					path: ["firstComponentIDs", i],
					code: "custom",
				});

			if (selectedComponents.includes(componentID))
				ctx.addIssue({
					message: "component selected multiple times",
					path: ["firstComponentIDs", i],
					code: "custom",
				});

			selectedComponents.push(componentID);
		}

		for (let i = 0; i < choice.secondComponentIDs.length; i++) {
			const componentID = choice.secondComponentIDs[i];
			if (!spacecraft.componentIDs.includes(componentID))
				ctx.addIssue({
					message: "selected component not on spacecraft",
					path: ["secondComponentIDs", i],
					code: "custom",
				});

			if (selectedComponents.includes(componentID))
				ctx.addIssue({
					message: "component selected multiple times",
					path: ["secondComponentIDs", i],
					code: "custom",
				});

			selectedComponents.push(componentID);
		}

		if (selectedComponents.length < spacecraft.componentIDs.length)
			ctx.addIssue({
				message: "not all spacecraft components selected",
				path: ["spacecraftID"],
				code: "custom",
			});
	});
