import { z } from "zod";

export const ZGetAutosaveSchema = z.object({
  id: z.string().cuid2().optional(),
});

export type TGetAutosaveSchema = z.infer<typeof ZGetAutosaveSchema>;
