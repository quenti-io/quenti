import { AssignmentType } from "@prisma/client";
import { z } from "zod";

export const ZCreateAssignmentSchema = z.object({
  classId: z.string().cuid(),
  sectionId: z.string().cuid(),
  type: z.nativeEnum(AssignmentType),
  title: z.string(),
  description: z.string().optional(),
  availableAt: z.coerce.date(),
  dueAt: z.coerce.date().optional().nullable(),
  lockedAt: z.coerce.date().optional().nullable(),
});

export type TCreateAssignmentSchema = z.infer<typeof ZCreateAssignmentSchema>;
