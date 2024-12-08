import type { Draft, Logger, ReducerReturnType } from "laika-engine";
import type { Game } from "../../../game";
import { getManeuver } from "../../../helpers";
import type {
	Decision,
	Interrupt,
	ManeuverInformation,
	Model,
} from "../../../model";
import { encounterLanding } from "./encounterLanding";

export function resolveLanding(
	model: Draft<Model>,
	logger: Logger<Game>,
	maneuverInformation: ManeuverInformation
): ReducerReturnType<Decision, Interrupt> {
	const maneuver = getManeuver(model, maneuverInformation.maneuverID);
	const profile = maneuver.profiles[maneuverInformation.profileIndex];

	const landingHazard = profile.hazards[maneuverInformation.nextHazardIndex];
	if (landingHazard.type !== "landing")
		throw new Error("expected landing hazard effect");

	if (landingHazard.optional) {
		return [
			{
				type: "encounter_landing",
				agencyID: maneuverInformation.agencyID,
				spacecraftID: maneuverInformation.spacecraftID,
			},
			{
				kind: "interrupt",
				value: {
					type: "continue_maneuver",
					...maneuverInformation,
					nextHazardIndex: maneuverInformation.nextHazardIndex + 1,
				},
			},
		];
	} else {
		const [decision, ...next] = encounterLanding(
			model,
			logger,
			maneuverInformation.agencyID,
			maneuverInformation.spacecraftID
		);

		if (decision) {
			return [
				decision,
				...next,
				{
					kind: "interrupt",
					value: {
						type: "continue_maneuver",
						...maneuverInformation,
						nextHazardIndex:
							maneuverInformation.nextHazardIndex + 1,
					},
				},
			];
		} else {
			return [];
		}
	}
}
