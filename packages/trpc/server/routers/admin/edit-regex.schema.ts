import { z } from "zod";
import { refineRegex } from "../../common/validation";

export const ZEditRegexSchema = z.object({
  oldRegex: z.string(),
  newRegex: z.string().refine(...refineRegex),
  label: z.string().trim().min(1),
});

export type TEditRegexSchema = z.infer<typeof ZEditRegexSchema>;
