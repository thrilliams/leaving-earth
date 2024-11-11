import type { Model } from "../../../state/model/Model";
import type { Draft } from "laika-engine";
import { getRandomNumber } from "./number";

export function shuffleArray<T>(model: Draft<Model>, sourceArray: T[]) {
	const array = sourceArray.slice();

	// fisher-yates shuffle
	for (let i = array.length - 1; i >= 0; i--) {
		// random int across [0, i];
		const randomIndex = getRandomNumber(model, i);
		// reassign array items
		[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
	}

	return array;
}

export function getRandomElement<T>(model: Draft<Model>, array: T[]) {
	const randomIndex = getRandomNumber(model, array.length);
	return array[randomIndex];
}

export function getRandomElements<T>(
	model: Draft<Model>,
	array: T[],
	number: number
) {
	if (number === 1) return [getRandomElement(model, array)];

	const shuffled = shuffleArray(model, array);
	return shuffled.slice(0, number);
}
