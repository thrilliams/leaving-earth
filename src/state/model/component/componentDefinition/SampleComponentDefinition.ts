import type { LocationID } from "@state/model/location/Location";
import type { MassComponentDefinition } from "./MassComponentDefinition";

export interface SampleComponentDefinition extends MassComponentDefinition {
	id:
		| "ceres_sample"
		| "mars_sample"
		| "moon_sample"
		| "phobos_sample"
		| "venus_sample";
	type: "sample";
	locationID: LocationID;
}
