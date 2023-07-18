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
    paymentId: z.string().nullable(),
    subscriptionId: z.string().nullable(),
    subscriptionItemId: z.string().nullable(),
  })
  .partial()
  .nullable();
