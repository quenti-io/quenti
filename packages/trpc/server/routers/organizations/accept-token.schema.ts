import { z } from "zod";

export const ZAcceptTokenSchema = z.object({
  token: z.string(),
  expiresInDays: z.number().optional(),
});

export type TAcceptTokenSchema = z.infer<typeof ZAcceptTokenSchema>;
