import { z } from "zod";

export const ZUploadLogoSchema = z.object({
  classId: z.string().cuid2(),
});

export type TUploadLogoSchema = z.infer<typeof ZUploadLogoSchema>;
