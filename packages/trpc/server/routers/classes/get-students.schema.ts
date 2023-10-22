import { z } from "zod";

export const ZGetStudentsSchema = z.object({
  classId: z.string().cuid2(),
  sectionId: z.string().cuid2().nullish(),
  query: z.string().nullish(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});

export type TGetStudentsSchema = z.infer<typeof ZGetStudentsSchema>;
