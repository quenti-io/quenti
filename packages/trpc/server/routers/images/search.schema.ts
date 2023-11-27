import { z } from "zod";

export const ZSearchSchema = z.object({
  query: z.string().transform((q) => q.trim().toLowerCase()),
});

export type TSearchSchema = z.infer<typeof ZSearchSchema>;
