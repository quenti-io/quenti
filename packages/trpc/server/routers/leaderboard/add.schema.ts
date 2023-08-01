import { LeaderboardType } from "@quenti/prisma/client";
import { z } from "zod";

export const ZAddSchema = z.object({
  mode: z.nativeEnum(LeaderboardType),
  time: z.number(),
  entityId: z.string(),
  eligible: z.boolean(),
});

export type TAddSchema = z.infer<typeof ZAddSchema>;
