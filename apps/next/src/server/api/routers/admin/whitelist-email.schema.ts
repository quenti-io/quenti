import { z } from "zod";

export const ZWhitelistEmailSchema = z.object({
  email: z.string().email(),
  delete: z.boolean().optional(),
});

export type TWhitelistEmailSchema = z.infer<typeof ZWhitelistEmailSchema>;
