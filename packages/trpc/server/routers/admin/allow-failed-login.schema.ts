import { z } from "zod";

export const ZAllowFailedLoginSchema = z.object({
  email: z.string().email(),
  allow: z.boolean(),
});

export type TAllowFailedLoginSchema = z.infer<typeof ZAllowFailedLoginSchema>;
