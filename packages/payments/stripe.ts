import Stripe from "stripe";

declare global {
  // eslint-disable-next-line no-var
  var stripe: Stripe | undefined;
}

export const stripe =
  globalThis.stripe ||
  new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
    apiVersion: "2023-08-16",
    typescript: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.stripe = stripe;
}
