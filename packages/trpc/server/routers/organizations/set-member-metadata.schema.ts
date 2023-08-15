import { z } from "zod";

import { orgMembershipMetadata } from "@quenti/prisma/zod-schemas";

export const ZSetMemberMetadataSchema = z.object({
  metadata: orgMembershipMetadata,
});

export type TSetMemberMetadataSchema = z.infer<typeof ZSetMemberMetadataSchema>;
