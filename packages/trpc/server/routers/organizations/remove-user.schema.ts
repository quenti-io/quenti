import { z } from "zod";

export const ZRemoveUserSchema = z.object({
  orgId: z.string().cuid2(),
  userId: z.string().cuid2(),
});

export type TRemoveUserSchema = z.infer<typeof ZRemoveUserSchema>;
