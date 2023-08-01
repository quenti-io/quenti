import { z } from "zod";

export const ZConfirmCodeSchema = z.object({
  orgId: z.string().cuid2(),
  code: z.string().length(6),
});

export type TConfirmCodeSchema = z.infer<typeof ZConfirmCodeSchema>;
