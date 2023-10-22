import { z } from "zod";

export const ZUploadLogoCompleteSchema = z.object({
  classId: z.string().cuid2(),
});

export type TUploadLogoCompleteSchema = z.infer<
  typeof ZUploadLogoCompleteSchema
>;
