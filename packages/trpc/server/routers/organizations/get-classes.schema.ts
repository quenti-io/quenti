import { z } from "zod";

export const ZGetClassesSchema = z.object({
  orgId: z.string().cuid2(),
});

export type TGetClassesSchema = z.infer<typeof ZGetClassesSchema>;
