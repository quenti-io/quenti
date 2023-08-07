import { DOMAIN_REGEX } from "@quenti/lib/constants/organizations";
import { z } from "zod";

export const ZAddStudentDomainSchema = z.object({
  orgId: z.string().cuid2(),
  domain: z.string().regex(DOMAIN_REGEX),
  email: z.string().email(),
});

export type TAddStudentDomainSchema = z.infer<typeof ZAddStudentDomainSchema>;
