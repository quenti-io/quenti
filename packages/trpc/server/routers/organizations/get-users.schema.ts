import { z } from "zod";

export const ZGetUsersSchema = z.object({
  orgId: z.string().cuid2(),
  type: z.enum(["Student", "Teacher"]),
  query: z.string().nullish(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});

export type TGetUsersSchema = z.infer<typeof ZGetUsersSchema>;
