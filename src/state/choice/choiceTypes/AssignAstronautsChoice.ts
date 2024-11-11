import { ComponentID } from "../../model/component/Component";
import type { AssignAstronautsDecision } from "../../decision/decisionTypes/AssignAstronautsDecision";
import { doesComponentExist, getComponent } from "../../helpers/component";
import { getComponentDefinition } from "../../helpers/component/definition";
import { getSpacecraft } from "../../helpers/spacecraft";
import type { Model } from "../../model/Model";
import type { Immutable } from "laika-engine";
import { z } from "zod";
import { BaseChoice } from "../Choice";

export type AssignAstronautsChoice = z.infer<
	ReturnType<typeof validateAssignAstronauts>
>;

export const validateAssignAstronauts = (
	model: Immutable<Model>,
	decision: Immutable<AssignAstronautsDecision>
) =>
	BaseChoice.extend({
		type: z.literal("assign_astronauts"),
		capsuleAssignments: z
			.strictObject({
				capsuleID: ComponentID,
				atronautIDs: ComponentID.array(),
			})
			.array(),
	}).superRefine((choice, ctx) => {
		const spacecraft = getSpacecraft(model, decision.spacecraftID);

		const astronautIDs = [];
		for (let i = 0; i < choice.capsuleAssignments.length; i++) {
			const assignment = choice.capsuleAssignments[i];

			if (!spacecraft.componentIDs.includes(assignment.capsuleID))
				ctx.addIssue({
					message: "capsule not present on spacecraft",
					path: ["capsuleAssignments", i, "capsuleID"],
					code: "custom",
				});

			if (!doesComponentExist(model, assignment.capsuleID)) {
				ctx.addIssue({
					message: "capsule does not exist",
					path: ["capsuleAssignments", i, "capsuleID"],
					code: "custom",
				});

				continue;
			}

			const capsule = getComponent(model, assignment.capsuleID);
			const capsuleDefinition = getComponentDefinition(
				model,
				capsule.type
			);

			if (capsuleDefinition.type !== "capsule")
				ctx.addIssue({
					message: "capsuleID does not refer to a capsule",
					path: ["capsuleAssignments", i, "capsuleID"],
					code: "custom",
				});
			else if (assignment.atronautIDs.length > capsuleDefinition.capacity)
				ctx.addIssue({
					message: "too many astronauts assigned to capsule",
					path: ["capsuleAssignments", i, "atronautIDs"],
					code: "custom",
				});

			for (let i = 0; i < assignment.atronautIDs.length; i++) {
				const astronautID = assignment.atronautIDs[i];

				const path = ["capsuleAssignments", i, "atronautIDs", i];

				if (!spacecraft.componentIDs.includes(astronautID))
					ctx.addIssue({
						message: "astronaut not present on spacecraft",
						path,
						code: "custom",
					});

				if (!doesComponentExist(model, astronautID)) {
					ctx.addIssue({
						message: "astronaut does not exist",
						path,
						code: "custom",
					});

					continue;
				}

				const astronaut = getComponent(model, astronautID);
				const astronautDefinition = getComponentDefinition(
					model,
					astronaut.type
				);

				if (astronautDefinition.type !== "astronaut")
					ctx.addIssue({
						message: "astronautID does not refer to an astronaut",
						path,
						code: "custom",
					});

				astronautIDs.push(astronautID);
			}
		}

		for (const astronautID of spacecraft.componentIDs) {
			const component = getComponent(model, astronautID);
			const definition = getComponentDefinition(model, component.type);
			if (
				definition.type === "astronaut" &&
				!astronautIDs.includes(astronautID)
			)
				ctx.addIssue({
					message: "not all astronauts assigned to capsules",
					code: "custom",
				});
		}
	});
