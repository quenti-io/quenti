import { z } from "zod";

export const ZRemoveRegexSchema = z.object({
  regex: z.string(),
});

export type TRemoveRegexSchema = z.infer<typeof ZRemoveRegexSchema>;
