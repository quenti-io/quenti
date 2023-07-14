import { z } from "zod";

export const ZAcceptInviteSchema = z.object({
  orgId: z.string().cuid2(),
  accept: z.boolean(),
});

export type TAcceptInviteSchema = z.infer<typeof ZAcceptInviteSchema>;
