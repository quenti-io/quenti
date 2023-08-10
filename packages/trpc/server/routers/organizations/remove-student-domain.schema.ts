import { z } from "zod";

export const ZRemoveStudentDomainSchema = z.object({
  orgId: z.string().cuid2(),
  domainId: z.string().cuid2(),
});

export type TRemoveStudentDomainSchema = z.infer<
  typeof ZRemoveStudentDomainSchema
>;
