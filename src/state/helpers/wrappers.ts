import type { Model } from "@state/model/Model";
import { createHelperWrappers } from "laika-engine";

export const { selector, predicate } = createHelperWrappers<Model>();
