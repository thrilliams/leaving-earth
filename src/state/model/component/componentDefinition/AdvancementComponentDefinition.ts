import type { AdvancementID } from "@state/model/advancement/Advancement";
import type { PurchasableComponentDefinition } from "./PurchasableComponentDefinition";

export interface AdvancementComponentDefinition
	extends PurchasableComponentDefinition {
	advancementID: AdvancementID;
}
