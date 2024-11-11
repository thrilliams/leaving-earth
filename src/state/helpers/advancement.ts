import { AdvancementID } from "../model/advancement/Advancement";
import { predicate, selector } from "./wrappers";
import type { AgencyID } from "../model/Agency";
import { getAgency } from "./agency";

export const doesAgencyHaveAdvancement = predicate(
	(model, agencyID: AgencyID, advancementID: AdvancementID) => {
		const agency = getAgency(model, agencyID);
		const advancement = agency.advancements[advancementID];
		return advancement !== undefined;
	}
);

export const getAdvancement = selector(
	(model, agencyID: AgencyID, advancementID: AdvancementID) => {
		const agency = getAgency(model, agencyID);
		const advancement = agency.advancements[advancementID];
		if (advancement !== undefined) return advancement;
		throw new Error("advancement ID could not be resolved");
	}
);

export const getAdvancementDefinition = selector(
	(model, advancementID: AdvancementID) => {
		const definition = model.advancementDefinitions[advancementID];
		if (definition !== undefined) return definition;
		throw new Error("advancement ID could not be resolved");
	}
);
