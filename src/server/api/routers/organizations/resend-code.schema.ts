import { z } from "zod";

export const ZResendCodeSchema = z.object({
  orgId: z.string().cuid2(),
});

export type TResendCodeSchema = z.infer<typeof ZResendCodeSchema>;
