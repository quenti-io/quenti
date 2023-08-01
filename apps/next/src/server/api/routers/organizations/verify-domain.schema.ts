import { z } from "zod";
import { DOMAIN_REGEX } from "../../../../constants/organizations";

export const ZVerifyDomainSchema = z.object({
  orgId: z.string().cuid2(),
  domain: z.string().regex(DOMAIN_REGEX),
  email: z.string().email(),
});

export type TVerifyDomainSchema = z.infer<typeof ZVerifyDomainSchema>;
