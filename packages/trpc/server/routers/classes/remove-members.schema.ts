import { z } from "zod";

export const ZRemoveMembersSchema = z.object({
  id: z.string(),
  users: z.array(z.string().cuid2()),
});

export type TRemoveMembersSchema = z.infer<typeof ZRemoveMembersSchema>;
