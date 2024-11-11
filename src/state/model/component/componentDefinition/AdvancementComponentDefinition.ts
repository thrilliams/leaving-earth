import type { AdvancementID } from "../../advancement/Advancement";
import type { PurchasableComponentDefinition } from "./PurchasableComponentDefinition";

export interface AdvancementComponentDefinition
	extends PurchasableComponentDefinition {
	advancementID: AdvancementID;
}
