import type { MaybeDraft } from "laika-engine";
import type { ExpansionID } from "../../expansion/ExpansionID";
import { AdvancementID } from "../../model/advancement/Advancement";
import { ComponentID } from "../../model/component/Component";
import { SpacecraftID } from "../../model/Spacecraft";
import { z } from "zod";

export const CooperateInformation = (expansions: MaybeDraft<ExpansionID[]>) =>
	z.strictObject({
		giveFunds: z.number().int().nonnegative(),
		receiveFunds: z.number().int().nonnegative(),
		giveComponentIDs: ComponentID.array(),
		receiveComponentIDs: ComponentID.array(),
		giveSpacecraftIDs: SpacecraftID.array(),
		receiveSpacecraftIDs: SpacecraftID.array(),
		giveAdvancementIDs: AdvancementID(expansions).array(),
		receiveAdvancementIDs: AdvancementID(expansions).array(),
	});

export type CooperateInformation = z.infer<
	ReturnType<typeof CooperateInformation>
>;
