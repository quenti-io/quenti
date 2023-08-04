import { z } from "zod";

export const ZJoinSchema = z
  .object({
    classId: z.string().cuid2().optional(),
    code: z.string().optional(),
  })
  .refine((data) => {
    return !!data.classId || !!data.code;
  });

export type TJoinSchema = z.infer<typeof ZJoinSchema>;
