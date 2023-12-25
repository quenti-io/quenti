import { AssignmentType } from "@prisma/client";
import { z } from "zod";

const THIRTY_MINUTES = 1000 * 60 * 30;

export const ZCreateAssignmentSchema = z.object({
  classId: z.string().cuid(),
  sectionId: z.string().cuid(),
  type: z.nativeEnum(AssignmentType),
  name: z.string(),
  description: z.string().optional(),
  availableAt: z.date().min(new Date()),
  dueAt: z
    .date()
    .min(new Date(Date.now() + THIRTY_MINUTES))
    .optional(),
  lockedAt: z
    .date()
    .min(new Date(Date.now() + THIRTY_MINUTES))
    .optional(),
});

export type TCreateAssignmentSchema = z.infer<typeof ZCreateAssignmentSchema>;
