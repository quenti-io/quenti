import { z } from "zod";

export const ZGetActivitySchema = z.object({
  id: z.string().cuid2(),
  period: z.enum(["12h", "24h", "5d", "14d", "30d"]),
});

export type TGetActivitySchema = z.infer<typeof ZGetActivitySchema>;
