import { orgMembershipMetadata } from "@quenti/prisma/zod-schemas";
import { z } from "zod";

export const ZSetMemberMetadataSchema = z.object({
  metadata: orgMembershipMetadata,
});

export type TSetMemberMetadataSchema = z.infer<typeof ZSetMemberMetadataSchema>;
