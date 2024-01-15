import { z } from "zod";

import { StudySetCollabType } from "@quenti/prisma/client";

export const ZEditCollabSchema = z.object({
  id: z.string().cuid(),
  type: z.nativeEnum(StudySetCollabType),
  minTermsPerUser: z.number().int().min(1).max(50).nullable(),
  maxTermsPerUser: z.number().int().min(1).max(50).nullable(),
});

export type TEditCollabSchema = z.infer<typeof ZEditCollabSchema>;
