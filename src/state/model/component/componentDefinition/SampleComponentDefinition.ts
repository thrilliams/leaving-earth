import type { LocationID } from "../../location/Location";
import type { MassComponentDefinition } from "./MassComponentDefinition";

export interface SampleComponentDefinition extends MassComponentDefinition {
	id:
		| "ceres_sample"
		| "mars_sample"
		| "moon_sample"
		| "phobos_sample"
		| "venus_sample"
		| "mercury_sample"
		| "ganymede_sample"
		| "io_sample"
		| "callisto_sample"
		| "europa_sample"
		| "enceladus_sample"
		| "saturn_sample";
	type: "sample";
	locationID: LocationID;
}
