import type { Model } from "../model/Model";
import { createHelperWrappers } from "laika-engine";

export const { selector, predicate } = createHelperWrappers<Model>();
