import { z } from "zod";

export const ZDeleteJoinCodeSchema = z.object({
  classId: z.string().cuid2(),
  sectionId: z.string().cuid2(),
});

export type TDeleteJoinCodeSchema = z.infer<typeof ZDeleteJoinCodeSchema>;
