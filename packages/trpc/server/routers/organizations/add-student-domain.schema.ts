import { z } from "zod";

import { DOMAIN_REGEX } from "@quenti/lib/constants/organizations";

export const ZAddStudentDomainSchema = z.object({
  orgId: z.string().cuid2(),
  domain: z.string().regex(DOMAIN_REGEX),
  email: z.string().email(),
});

export type TAddStudentDomainSchema = z.infer<typeof ZAddStudentDomainSchema>;
