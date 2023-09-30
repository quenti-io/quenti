import { inngest } from "@quenti/inngest";
import { allEqual } from "@quenti/lib/array";

import { TRPCError } from "@trpc/server";

import { getIp } from "../../lib/get-ip";
import {
  isInOrganizationBase,
  isOrganizationAdmin,
} from "../../lib/queries/organizations";
import { RateLimitType, rateLimitOrThrowMultiple } from "../../lib/rate-limit";
import type { NonNullableUserContext } from "../../lib/types";
import type { TInviteTeachersSchema } from "./invite-teachers.schema";

type InviteTeachersOptions = {
  ctx: NonNullableUserContext;
  input: TInviteTeachersSchema;
};

export const inviteTeachersHandler = async ({
  ctx,
  input,
}: InviteTeachersOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  await rateLimitOrThrowMultiple({
    type: RateLimitType.FanOut,
    identifiers: [
      `orgs:invite-teachers-user-id-${ctx.session.user.id}`,
      `orgs:invite-teachers-ip-${getIp(ctx.req)}`,
    ],
  });

  const org = await ctx.prisma.organization.findUniqueOrThrow({
    where: {
      id: input.orgId,
    },
  });
  if (!org.published)
    throw new TRPCError({ code: "FORBIDDEN", message: "not_published" });

  const emailDomains = input.emails.map((e) => e.split("@")[1]!);
  if (
    !allEqual(emailDomains) ||
    !(await isInOrganizationBase(`email@${emailDomains[0]!}`, input.orgId))
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "contains_invalid_emails",
    });
  }

  const existingUsers = await ctx.prisma.user.findMany({
    where: {
      email: {
        in: input.emails,
      },
    },
    select: {
      email: true,
    },
  });

  const invites = input.emails.filter(
    (email) => !existingUsers.find((u) => u.email === email),
  );

  const inviter = {
    id: ctx.session.user.id,
    image: ctx.session.user.image!,
    name: ctx.session.user.name,
    email: ctx.session.user.email!,
  };

  await ctx.prisma.user.updateMany({
    where: {
      email: {
        in: invites,
      },
      organizationId: null,
    },
    data: {
      organizationId: input.orgId,
    },
  });

  await inngest.send({
    name: "orgs/invite-teachers",
    data: {
      inviter,
      org,
      emails: invites,
    },
  });

  return { invited: invites.length };
};

export default inviteTeachersHandler;
