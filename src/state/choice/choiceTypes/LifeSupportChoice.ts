import { ComponentID } from "../../model/component/Component";
import { z } from "zod";
import { BaseChoice } from "../Choice";
import type { Immutable } from "laika-engine";
import type { Model } from "../../model/Model";
import type { LifeSupportDecision } from "../../decision/decisionTypes/LifeSupportDecision";
import { getSpacecraft } from "../../helpers/spacecraft";
import {
	doesComponentExist,
	getComponent,
	isComponentOfType,
} from "../../helpers/component";

export type LifeSupportChoice = z.infer<ReturnType<typeof validateLifeSupport>>;

export const validateLifeSupport = (
	model: Immutable<Model>,
	decision: Immutable<LifeSupportDecision>
) =>
	BaseChoice.extend({
		type: z.literal("life_support"),
		astronautIDs: ComponentID.array().superRefine((astronautIDs, ctx) => {
			const spacecraft = getSpacecraft(model, decision.spacecraftID);

			for (let i = 0; i < astronautIDs.length; i++) {
				const astronautID = astronautIDs[i];

				if (!doesComponentExist(model, astronautID))
					return ctx.addIssue({
						message: "select astronaut does not exist",
						path: [i],
						code: "custom",
					});

				const astronaut = getComponent(model, astronautID);
				if (!isComponentOfType(model, astronaut, "astronaut"))
					ctx.addIssue({
						message: "selected component not astronauts",
						path: [i],
						code: "custom",
					});

				if (!spacecraft.componentIDs.includes(astronautID))
					ctx.addIssue({
						message: "selected astronaut not present on spacecraft",
						path: [i],
						code: "custom",
					});
			}

			if (astronautIDs.length !== decision.capacity)
				ctx.addIssue({
					message: "incorrect number of astronauts selected",
					path: [],
					code: "custom",
				});
		}),
	});
