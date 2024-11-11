import { AdvancementID } from "../../model/advancement/Advancement";
import { ComponentID } from "../../model/component/Component";
import { SpacecraftID } from "../../model/Spacecraft";
import { z } from "zod";

export const CooperateInformation = z.strictObject({
	giveFunds: z.number().int().nonnegative(),
	receiveFunds: z.number().int().nonnegative(),
	giveComponentIDs: ComponentID.array(),
	receiveComponentIDs: ComponentID.array(),
	giveSpacecraftIDs: SpacecraftID.array(),
	receiveSpacecraftIDs: SpacecraftID.array(),
	giveAdvancementIDs: AdvancementID.array(),
	receiveAdvancementIDs: AdvancementID.array(),
});

export type CooperateInformation = z.infer<typeof CooperateInformation>;
