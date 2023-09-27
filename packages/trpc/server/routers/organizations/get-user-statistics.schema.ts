import { z } from "zod";

export const ZGetUserStatisticsSchema = z.object({
  id: z.string().cuid2(),
});

export type TGetUserStatisticsSchema = z.infer<typeof ZGetUserStatisticsSchema>;
