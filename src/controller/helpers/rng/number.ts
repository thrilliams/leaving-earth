import type { Model } from "@state/model/Model";
import type { Draft } from "laika-engine";
import { uniformIntDistribution, xoroshiro128plus } from "pure-rand";

export function seedRandomNumberGenerator(
	model: Draft<Model>,
	seed = Math.random()
) {
	model.rngState = [...xoroshiro128plus(seed).getState!()];
}

export function getRandomNumber(
	model: Draft<Model>,
	from: number,
	to: number
): number;
export function getRandomNumber(model: Draft<Model>, to: number): number;
export function getRandomNumber(
	model: Draft<Model>,
	fromOrTo: number,
	to?: number
) {
	const generator = xoroshiro128plus.fromState(model.rngState);
	const [randomNumber, next] = uniformIntDistribution(
		to !== undefined ? fromOrTo : 0,
		to !== undefined ? to : fromOrTo,
		generator
	);

	// this is actually fine; the optionality comes from the parent class but
	// xoroshiro128plus does in fact implement this method so its all good
	model.rngState = [...next.getState!()];
	return randomNumber;
}

export function getD8(model: Draft<Model>) {
	return getRandomNumber(model, 1, 8);
}
