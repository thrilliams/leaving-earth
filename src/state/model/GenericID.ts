import { z } from "zod";

export const GenericID = z.number().int().nonnegative();
export type GenericID = z.infer<typeof GenericID>;
