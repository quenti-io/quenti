import { z } from "zod";

export const orgMetadataSchema = z
  .object({
    requestedDomain: z.string(),
    paymentId: z.string(),
    subscriptionId: z.string(),
    subscriptionItemId: z.string(),
  })
  .partial()
  .nullable();
