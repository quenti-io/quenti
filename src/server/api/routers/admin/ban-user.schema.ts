import { z } from "zod";

export const ZBanUserSchema = z.object({
  userId: z.string().cuid2(),
  banned: z.boolean(),
});

export type TBanUserSchema = z.infer<typeof ZBanUserSchema>;
