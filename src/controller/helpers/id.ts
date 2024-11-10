import type { GenericID } from "@state/model/GenericID";
import type { Model } from "@state/model/Model";
import type { Draft } from "laika-engine";

export function getNextID(model: Draft<Model>): GenericID {
	return model.nextID++;
}
