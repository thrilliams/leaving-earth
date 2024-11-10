import type { BaseComponentDefinition } from "./BaseComponentDefinition";

export interface PurchasableComponentDefinition
	extends BaseComponentDefinition {
	cost: number;
}
