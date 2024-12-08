import type { Immutable } from "laika-engine";
import { z } from "zod";
import {
	doesAgencyOwnSpacecraft,
	getComponent,
	getComponentDefinition,
} from "../../../../helpers";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import {
	doesSpacecraftExist,
	getSpacecraft,
} from "../../../helpers/spacecraft";
import type { Model } from "../../../model/Model";
import { SpacecraftID } from "../../../model/Spacecraft";
import { BaseTakeActionChoice } from "./ActionType";

export type DiscardExplorerActionChoice = z.infer<
	ReturnType<typeof validateDiscardExplorerAction>
>;

export const validateDiscardExplorerAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("discard_explorer"),
		spacecraftID: SpacecraftID,
	}).superRefine((choice, ctx) => {
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
			return ctx.addIssue({
				message: "spacecraft owned by another agency",
				path: ["spacecraftID"],
				code: "custom",
			});

		const spacecraft = getSpacecraft(model, choice.spacecraftID);

		if (spacecraft.years > 0)
			ctx.addIssue({
				message:
					"explorer cannot be discard during multi-year maneuver",
				path: ["spacecraftID"],
				code: "custom",
			});

		if (spacecraft.componentIDs.length !== 1)
			ctx.addIssue({
				message:
					"explorer can only be discard when it is the only component on the spacecraft",
				path: ["spacecraftID"],
				code: "custom",
			});

		for (let i = 0; i < spacecraft.componentIDs.length; i++) {
			const componentID = spacecraft.componentIDs[i];
			const component = getComponent(model, componentID);

			const definition = getComponentDefinition(model, component.type);
			if (definition.type !== "explorer")
				ctx.addIssue({
					message:
						"explorer can only be discard when it is the only component on the spacecraft",
					path: ["spacecraftID", i],
					code: "custom",
				});
		}

		let matchingExplorerMission = false;
		for (const mission of model.missions) {
			if (mission.type !== "discard_explorer") continue;
			if (mission.locationID !== spacecraft.locationID) continue;
			matchingExplorerMission = true;
		}

		if (!matchingExplorerMission)
			ctx.addIssue({
				message:
					"explorer can only be discard when a mission to do so is available",
				path: ["spacecraftID"],
				code: "custom",
			});
	});
