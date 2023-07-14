import { z } from "zod";

export const ZSetInviteExpirationSchema = z.object({
  token: z.string(),
  expiresInDays: z.number().optional(),
});

export type TSetInviteExpirationSchema = z.infer<
  typeof ZSetInviteExpirationSchema
>;
