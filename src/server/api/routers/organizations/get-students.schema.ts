import { z } from "zod";

export const ZGetStudentsSchema = z.object({
  orgId: z.string(),
});

export type TGetStudentsSchema = z.infer<typeof ZGetStudentsSchema>;
