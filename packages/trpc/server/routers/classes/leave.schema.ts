import { z } from "zod";

export const ZLeaveSchema = z.object({
  id: z.string(),
});

export type TLeaveSchema = z.infer<typeof ZLeaveSchema>;
