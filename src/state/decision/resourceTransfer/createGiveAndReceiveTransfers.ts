import type { AgencyID } from "../../model/Agency";
import type { CooperateInformation } from "./CooperateInformation";
import type { ResourceTransfer } from "./ResourceTransfer";
import type { MaybeDraft } from "laika-engine";

export function createGiveAndReceiveTransfers(
	givingAgencyID: AgencyID,
	receivingAgencyID: AgencyID,
	info: MaybeDraft<CooperateInformation>
): [ResourceTransfer, ResourceTransfer] {
	const give = {
		from: givingAgencyID,
		to: receivingAgencyID,
		funds: info.giveFunds,
		components: info.giveComponentIDs,
		spacecraft: info.giveSpacecraftIDs,
		advancements: info.giveAdvancementIDs,
	};

	const receive = {
		from: receivingAgencyID,
		to: givingAgencyID,
		funds: info.receiveFunds,
		components: info.receiveComponentIDs,
		spacecraft: info.receiveSpacecraftIDs,
		advancements: info.receiveAdvancementIDs,
	};

	return [give as ResourceTransfer, receive as ResourceTransfer];
}
