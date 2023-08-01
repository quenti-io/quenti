import { z } from "zod";

export const ZVerifyUserSchema = z.object({
  userId: z.string().cuid2(),
  verified: z.boolean(),
});

export type TVerifyUserSchema = z.infer<typeof ZVerifyUserSchema>;
