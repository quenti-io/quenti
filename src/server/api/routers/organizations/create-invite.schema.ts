import { z } from "zod";

export const ZCreateInviteSchema = z.object({
  orgId: z.string().cuid2(),
});

export type TCreateInviteSchema = z.infer<typeof ZCreateInviteSchema>;
