import type { Immutable } from "laika-engine";
import { z } from "zod";
import type { TakeActionDecision } from "../../../decision/decisionTypes/TakeActionDecision";
import { CooperateInformation } from "../../../decision/resourceTransfer/CooperateInformation";
import {
	doesAgencyHaveAdvancement,
	getAdvancement,
} from "../../../helpers/advancement";
import {
	doesAgencyExist,
	doesAgencyOwnComponent,
	doesAgencyOwnSpacecraft,
	getAgency,
} from "../../../helpers/agency";
import { doesComponentExist } from "../../../helpers/component";
import {
	doesSpacecraftExist,
	isComponentOnSpacecraft,
} from "../../../helpers/spacecraft";
import { AgencyID } from "../../../model/Agency";
import type { Model } from "../../../model/Model";
import { BaseTakeActionChoice } from "./ActionType";

export type CooperateActionChoice = z.infer<
	ReturnType<typeof validateCooperateAction>
>;

export const validateCooperateAction = (
	model: Immutable<Model>,
	decision: Immutable<TakeActionDecision>
) =>
	BaseTakeActionChoice.extend({
		action: z.literal("cooperate"),
		agencyID: AgencyID,
	})
		.and(CooperateInformation(model.expansions))
		.superRefine((choice, ctx) => {
			// TODO: this is so fucking verbose holy shit we're doing exactly the same operations to two symmetrical pieces of data but the code is repeated since the keys are different. fix this.

			if (decision.agencyID === choice.agencyID)
				ctx.addIssue({
					message: "cannot cooperate with self",
					path: ["agencyID"],
					code: "custom",
				});

			if (!doesAgencyExist(model, choice.agencyID))
				return ctx.addIssue({
					message: "selected agency does not exist",
					path: ["agencyID"],
					code: "custom",
				});

			// giving half
			const fromAgency = getAgency(model, decision.agencyID);

			if (choice.giveFunds > fromAgency.funds)
				ctx.addIssue({
					message: "insufficient funds",
					path: ["giveFunds"],
					code: "custom",
				});

			for (let i = 0; i < choice.giveComponentIDs.length; i++) {
				const componentID = choice.giveComponentIDs[i];

				if (!doesComponentExist(model, componentID)) {
					ctx.addIssue({
						message: "selected component does not exist",
						path: ["giveComponentIDs", i],
						code: "custom",
					});
					continue;
				}

				if (
					!doesAgencyOwnComponent(
						model,
						decision.agencyID,
						componentID
					)
				)
					ctx.addIssue({
						message: "selected component owned by another agency",
						path: ["giveComponentIDs", i],
						code: "custom",
					});

				if (isComponentOnSpacecraft(model, componentID))
					ctx.addIssue({
						message: "selected components on spacecraft",
						path: ["giveComponentIDs", i],
						code: "custom",
					});
			}

			for (let i = 0; i < choice.giveSpacecraftIDs.length; i++) {
				const spacecraftID = choice.giveSpacecraftIDs[i];

				if (!doesSpacecraftExist(model, spacecraftID)) {
					ctx.addIssue({
						message: "selected spacecraft does not exist",
						path: ["giveSpacecraftIDs", i],
						code: "custom",
					});
					continue;
				}

				if (
					!doesAgencyOwnSpacecraft(
						model,
						decision.agencyID,
						spacecraftID
					)
				)
					ctx.addIssue({
						message: "selected spacecraft owned by another agency",
						path: ["giveSpacecraftIDs", i],
						code: "custom",
					});
			}

			for (let i = 0; i < choice.giveAdvancementIDs.length; i++) {
				const advancementID = choice.giveAdvancementIDs[i];

				if (
					!doesAgencyHaveAdvancement(
						model,
						decision.agencyID,
						advancementID
					)
				)
					ctx.addIssue({
						message: "selected advancement not researched",
						path: ["giveAdvancementIDs", i],
						code: "custom",
					});

				// if the other agency doesn't have the advancement, we don't need
				// to check the number of outcomes
				if (
					!doesAgencyHaveAdvancement(
						model,
						choice.agencyID,
						advancementID
					)
				)
					continue;

				const advancement = getAdvancement(
					model,
					decision.agencyID,
					advancementID
				);
				const otherAdvancement = getAdvancement(
					model,
					choice.agencyID,
					advancementID
				);

				if (
					advancement.outcomes.length <=
					otherAdvancement.outcomes.length
				)
					ctx.addIssue({
						message:
							"selected advancement already more advanced by receiving agency",
						path: ["giveAdvancementIDs", i],
						code: "custom",
					});
			}

			// receiving half
			const toAgency = getAgency(model, choice.agencyID);

			if (choice.receiveFunds > toAgency.funds)
				ctx.addIssue({
					message: "insufficient funds",
					path: ["receiveFunds"],
					code: "custom",
				});

			for (let i = 0; i < choice.receiveComponentIDs.length; i++) {
				const componentID = choice.receiveComponentIDs[i];

				if (!doesComponentExist(model, componentID)) {
					ctx.addIssue({
						message: "selected component does not exist",
						path: ["receiveComponentIDs", i],
						code: "custom",
					});
					continue;
				}

				if (
					!doesAgencyOwnComponent(model, choice.agencyID, componentID)
				)
					ctx.addIssue({
						message: "selected component owned by another agency",
						path: ["receiveComponentIDs", i],
						code: "custom",
					});

				if (isComponentOnSpacecraft(model, componentID))
					ctx.addIssue({
						message: "selected components on spacecraft",
						path: ["receiveComponentIDs", i],
						code: "custom",
					});
			}

			for (let i = 0; i < choice.receiveSpacecraftIDs.length; i++) {
				const spacecraftID = choice.receiveSpacecraftIDs[i];

				if (!doesSpacecraftExist(model, spacecraftID)) {
					ctx.addIssue({
						message: "selected spacecraft does not exist",
						path: ["receiveSpacecraftIDs", i],
						code: "custom",
					});
					continue;
				}

				if (
					!doesAgencyOwnSpacecraft(
						model,
						choice.agencyID,
						spacecraftID
					)
				)
					ctx.addIssue({
						message: "selected spacecraft owned by another agency",
						path: ["receiveSpacecraftIDs", i],
						code: "custom",
					});
			}

			for (let i = 0; i < choice.receiveAdvancementIDs.length; i++) {
				const advancementID = choice.receiveAdvancementIDs[i];

				if (
					!doesAgencyHaveAdvancement(
						model,
						choice.agencyID,
						advancementID
					)
				)
					ctx.addIssue({
						message: "selected advancement not researched",
						path: ["receiveAdvancementIDs", i],
						code: "custom",
					});

				if (
					!doesAgencyHaveAdvancement(
						model,
						decision.agencyID,
						advancementID
					)
				)
					continue;

				const advancement = getAdvancement(
					model,
					choice.agencyID,
					advancementID
				);
				const otherAdvancement = getAdvancement(
					model,
					decision.agencyID,
					advancementID
				);

				if (
					advancement.outcomes.length <=
					otherAdvancement.outcomes.length
				)
					ctx.addIssue({
						message:
							"selected advancement already more advanced by receiving agency",
						path: ["receiveAdvancementIDs", i],
						code: "custom",
					});
			}
		});
