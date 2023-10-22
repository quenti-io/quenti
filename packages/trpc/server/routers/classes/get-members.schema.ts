import { z } from "zod";

export const ZGetMembersSchema = z.object({
  id: z.string().cuid2(),
});

export type TGetMembersSchema = z.infer<typeof ZGetMembersSchema>;
