import { z } from "zod";

export const ZImportProfileSchema = z.object({
  username: z.string().min(1),
});

export type TImportProfileSchema = z.infer<typeof ZImportProfileSchema>;
