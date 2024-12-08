import type { Maneuver } from "../../model";

export const endOfTurnToLost = (): Maneuver => ({
	destinationID: "lost",
	profiles: [{ difficulty: null, hazards: [] }],
});
