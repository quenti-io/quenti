import { z } from "zod";

export const ZDeleteSchema = z.object({
  folderId: z.string(),
});

export type TDeleteSchema = z.infer<typeof ZDeleteSchema>;
