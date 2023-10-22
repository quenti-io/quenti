import { z } from "zod";

import { refineRegex } from "../../common/validation";

export const ZSetDomainFilterSchema = z.object({
  orgId: z.string().cuid2(),
  domainId: z.string().cuid2(),
  filter: z
    .string()
    .refine(...refineRegex)
    .nullable(),
});

export type TSetDomainFilterSchema = z.infer<typeof ZSetDomainFilterSchema>;
