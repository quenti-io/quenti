import { inngest } from "@quenti/inngest";
import { allEqual } from "@quenti/lib/array";

import { TRPCError } from "@trpc/server";

import { getIp } from "../../lib/get-ip";
import {
  isInOrganizationBase,
  isOrganizationAdmin,
  isOrganizationOwner,
} from "../../lib/queries/organizations";
import { RateLimitType, rateLimitOrThrowMultiple } from "../../lib/rate-limit";
import type { NonNullableUserContext } from "../../lib/types";
import type { TInviteMemberSchema } from "./invite-member.schema";

type InviteMemberOptions = {
  ctx: NonNullableUserContext;
  input: TInviteMemberSchema;
};

export const inviteMemberHandler = async ({
  ctx,
  input,
}: InviteMemberOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  await rateLimitOrThrowMultiple({
    type: RateLimitType.FanOut,
    identifiers: [
      `orgs:invite-member-user-id-${ctx.session.user.id}`,
      `orgs:invite-member-ip-${getIp(ctx.req)}`,
    ],
  });

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

  if (
    input.role == "Owner" &&
    !(await isOrganizationOwner(ctx.session.user.id, input.orgId))
  )
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only owners can invite owners",
    });

  const existingUsers = await ctx.prisma.user.findMany({
    where: {
      email: {
        in: input.emails,
      },
    },
    select: {
      id: true,
      email: true,
      organization: {
        select: {
          id: true,
        },
      },
      orgMembership: {
        select: {
          id: true,
        },
      },
    },
  });

  const existingInvites = await ctx.prisma.pendingOrganizationInvite.findMany({
    where: {
      orgId: input.orgId,
    },
  });

  // Ignore all emails from existing pending invites
  // Ignore all emails from existing users that already have a membership in the org
  const invites: { id: string | null; email: string }[] = [];
  const signupEmails: string[] = [];
  const loginEmails: string[] = [];

  for (const email of input.emails) {
    const invite = existingInvites.find((i) => i.email === email);
    if (invite) continue;
    const user = existingUsers.find((u) => u.email === email);
    if (user?.orgMembership) continue;

    invites.push({
      id: user?.id ?? null,
      email,
    });
    if (user) loginEmails.push(email);
    else signupEmails.push(email);
  }

  await ctx.prisma.pendingOrganizationInvite.createMany({
    data: invites.map((invite) => ({
      email: invite.email,
      orgId: input.orgId,
      role: input.role,
      userId: invite.id,
    })),
  });

  if (input.sendEmail) {
    const org = await ctx.prisma.organization.findUniqueOrThrow({
      where: {
        id: input.orgId,
      },
    });

    const inviter = {
      id: ctx.session.user.id,
      image: ctx.session.user.image!,
      name: ctx.session.user.name,
      email: ctx.session.user.email!,
    };

    await inngest.send({
      name: "orgs/invite-members",
      data: {
        inviter,
        org,
        signupEmails,
        loginEmails,
      },
    });
  }
};

export default inviteMemberHandler;
