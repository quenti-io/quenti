import { DOMAIN_REGEX } from "@quenti/lib/constants/organizations";
import { z } from "zod";

export const ZVerifyDomainSchema = z.object({
  orgId: z.string().cuid2(),
  domain: z.string().regex(DOMAIN_REGEX),
  email: z.string().email(),
});

export type TVerifyDomainSchema = z.infer<typeof ZVerifyDomainSchema>;
