import { z } from "zod";

export const ZGetClassStatisticsSchema = z.object({
  id: z.string().cuid2(),
});

export type TGetClassStatisticsSchema = z.infer<
  typeof ZGetClassStatisticsSchema
>;
