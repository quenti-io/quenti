import z from "zod";

import { refineRegex } from "../../common/validation";

export const ZAddRegexSchema = z.object({
  regex: z.string().refine(...refineRegex),
  label: z.string().trim().min(1),
});

export type TAddRegexSchema = z.infer<typeof ZAddRegexSchema>;
