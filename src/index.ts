export {
	createInitialGameState,
	reduceChoice,
	validateChoice,
	type LeavingEarthGame,
} from "./game";

export type { Choice } from "./state/choice/Choice";
export type { Decision } from "./state/decision/Decision";
export type { Interrupt } from "./state/interrupt/Interrupt";
export type { Model } from "./state/model/Model";

export type { Draft, Immutable } from "laika-engine";
