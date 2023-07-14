import { ContainerType } from "@prisma/client";
import { z } from "zod";

export const ZSetMatchStudyStarredSchema = z.object({
  entityId: z.string(),
  type: z.nativeEnum(ContainerType),
  matchStudyStarred: z.boolean(),
});

export type TSetMatchStudyStarredSchema = z.infer<
  typeof ZSetMatchStudyStarredSchema
>;
