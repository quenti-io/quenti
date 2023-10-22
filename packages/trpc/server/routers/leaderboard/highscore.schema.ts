import { z } from "zod";

import { LeaderboardType } from "@quenti/prisma/client";

export const ZHighscoreSchema = z.object({
  mode: z.nativeEnum(LeaderboardType),
  entityId: z.string(),
  eligible: z.boolean(),
});

export type THighscoreSchema = z.infer<typeof ZHighscoreSchema>;
