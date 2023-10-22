import { z } from "zod";

export const ZRemoveMembersSchema = z.object({
  id: z.string(),
  members: z.array(z.string().cuid2()),
  type: z.enum(["member", "invite"]),
});

export type TRemoveMembersSchema = z.infer<typeof ZRemoveMembersSchema>;
