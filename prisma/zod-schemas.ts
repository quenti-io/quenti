import { z } from "zod";

export const userMetadataSchema = z
  .object({
    stripeCustomerId: z.string(),
  })
  .partial()
  .nullable();

export const orgMetadataSchema = z
  .object({
    requestedDomain: z.string(),
    paymentId: z.string(),
    subscriptionId: z.string(),
    subscriptionItemId: z.string(),
  })
  .partial()
  .nullable();
