import { z } from "zod";

export const ZSetDisplayNameSchema = z.object({
  displayName: z.boolean(),
});

export type TSetDisplayNameSchema = z.infer<typeof ZSetDisplayNameSchema>;
