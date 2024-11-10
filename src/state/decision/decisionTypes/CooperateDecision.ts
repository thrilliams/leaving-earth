import type { AgencyID } from "@state/model/Agency";
import type { BaseDecision } from "../Decision";
import type { CooperateInformation } from "../resourceTransfer/CooperateInformation";

export interface CooperateDecision extends BaseDecision, CooperateInformation {
	type: "cooperate";
	fromAgencyID: AgencyID;
}
