import { z } from "zod";

import { USERNAME_REGEXP } from "@quenti/lib/constants/characters";

export const ZGetShareIdSchema = z
  .object({
    folderId: z.string().cuid2(),
    username: z.string().max(40).regex(USERNAME_REGEXP),
    idOrSlug: z.string(),
  })
  .partial()
  .refine((data) => {
    if (data.folderId) return true;
    if (data.username && data.idOrSlug) return true;
    return false;
  }, "Must provide either folderId or username and idOrSlug");

export type TGetShareIdSchema = z.infer<typeof ZGetShareIdSchema>;
