import { z } from "zod";

export const ZSetEnabledFlagsSchema = z.object({
  userId: z.string().cuid2(),
  flags: z.number(),
});

export type TSetEnabledFlagsSchema = z.infer<typeof ZSetEnabledFlagsSchema>;
