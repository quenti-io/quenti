import { z } from "zod";

export const ZUploadLogoSchema = z.object({
  orgId: z.string().cuid2(),
});

export type TUploadLogoSchema = z.infer<typeof ZUploadLogoSchema>;
