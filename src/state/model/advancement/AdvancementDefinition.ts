import type { AstronautSpeciality } from "../component/componentDefinition/AstronautComponentDefinition";
import type { AdvancementID } from "./Advancement";

export type AdvancementDefinition = {
	id: AdvancementID;
	startingOutcomes: number;
	speciality?: AstronautSpeciality;
	improveMajorFailures?: boolean;
};
