import { AdvancementID } from "@state/model/advancement/Advancement";
import { ComponentID } from "@state/model/component/Component";
import { SpacecraftID } from "@state/model/Spacecraft";
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
