import { z } from "zod";

export const ZVerifyStudentDomainSchema = z.object({
  orgId: z.string().cuid2(),
  code: z.string().length(6),
});

export type TVerifyStudentDomainSchema = z.infer<
  typeof ZVerifyStudentDomainSchema
>;
