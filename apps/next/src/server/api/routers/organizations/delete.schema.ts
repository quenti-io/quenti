import { z } from "zod";

export const ZDeleteSchema = z.object({
  orgId: z.string().cuid2(),
});

export type TDeleteSchema = z.infer<typeof ZDeleteSchema>;
