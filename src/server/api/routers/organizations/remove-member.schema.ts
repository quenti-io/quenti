import { z } from "zod";

export const ZRemoveMemberSchema = z.object({
  orgId: z.string().cuid2(),
  userId: z.string().cuid2(),
});

export type TRemoveMemberSchema = z.infer<typeof ZRemoveMemberSchema>;
