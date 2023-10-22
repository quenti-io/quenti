import { HttpError } from "@quenti/lib/http-error";
import { prisma } from "@quenti/prisma";
import { Prisma } from "@quenti/prisma/client";
import { userMetadataSchema } from "@quenti/prisma/zod-schemas";

import { stripe } from "./stripe";

const selectedUser = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    metadata: true,
  },
});

type SelectedUser = Prisma.UserGetPayload<typeof selectedUser>;

export const getStripeCustomerIdFromUserId = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, metadata: true },
  });

  if (!user)
    throw new HttpError({ statusCode: 404, message: "User not found" });
  if (!user.email)
    throw new HttpError({ statusCode: 404, message: "User email not found" });

  return await getStripeCustomerId(user);
};

export const getStripeCustomerId = async (user: SelectedUser) => {
  const metadata = userMetadataSchema.parse(user.metadata);
  if (metadata?.stripeCustomerId) {
    return metadata.stripeCustomerId;
  }

  const customers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  });

  if (customers.data[0]?.id) {
    await updateUserWithCustomerId(user, customers.data[0].id);
    return customers.data[0].id;
  }

  const customer = await stripe.customers.create({ email: user.email });
  await updateUserWithCustomerId(user, customer.id);

  return customer.id;
};

export const updateUserWithCustomerId = async (
  user: SelectedUser,
  customerId: string,
) => {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      metadata: {
        ...(user.metadata as Prisma.JsonObject),
        stripeCustomerId: customerId,
      },
    },
  });
};
