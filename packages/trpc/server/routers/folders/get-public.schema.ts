import { z } from "zod";

import { USERNAME_REGEXP } from "@quenti/lib/constants/characters";

export const ZGetPublicSchema = z.object({
  username: z.string().max(40).regex(USERNAME_REGEXP),
  idOrSlug: z.string(),
  includeTerms: z.boolean().optional(),
});

export type TGetPublicSchema = z.infer<typeof ZGetPublicSchema>;
