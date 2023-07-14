import { LeaderboardType } from "@prisma/client";
import { z } from "zod";

export const ZByEntityIdSchema = z.object({
  mode: z.nativeEnum(LeaderboardType),
  entityId: z.string(),
});

export type TByEntityIdSchema = z.infer<typeof ZByEntityIdSchema>;
