import { z } from "zod";

export const ZJoinSchema = z
  .object({
    id: z.string().cuid2().optional(),
    code: z.string().optional(),
  })
  .refine((data) => {
    return !!data.id || !!data.code;
  });

export type TJoinSchema = z.infer<typeof ZJoinSchema>;
