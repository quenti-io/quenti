import { z } from "zod";

export const ZCreateJoinCodeSchema = z.object({
  classId: z.string().cuid2(),
  sectionId: z.string().cuid2(),
});

export type TCreateJoinCodeSchema = z.infer<typeof ZCreateJoinCodeSchema>;
