import { TRPCError } from "@trpc/server";
import { sendOrganizationInviteEmail } from "../../../../emails/resend";
import { env } from "@quenti/env/client";
import { getIp } from "../../../lib/get-ip";
import {
  isOrganizationAdmin,
  isOrganizationOwner,
} from "../../../lib/queries/organizations";
import {
  RateLimitType,
  rateLimitOrThrowMultiple,
} from "../../../lib/rate-limit";
import type { NonNullableUserContext } from "../../../lib/types";
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

  if (
    input.role == "Owner" &&
    !(await isOrganizationOwner(ctx.session.user.id, input.orgId))
  )
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only owners can invite owners",
    });

  let existingUsers = await ctx.prisma.user.findMany({
    where: {
      email: {
        in: input.emails,
      },
    },
    select: {
      id: true,
      email: true,
      organizations: {
        where: {
          orgId: input.orgId,
        },
      },
    },
  });

  const existingInvites = await ctx.prisma.pendingInvite.findMany({
    where: {
      orgId: input.orgId,
    },
  });

  // Filter out users that are already part of the organization
  existingUsers = existingUsers.filter((u) => u.organizations.length === 0);

  const existingIds = existingUsers.map((u) => u.id);
  const existingEmails = existingUsers.map((u) => u.email).filter((e) => !!e);
  const existingInviteEmails = existingInvites.map((i) => i.email);

  const pendingInvites = input.emails.filter(
    (e) => !existingEmails.includes(e) && !existingInviteEmails.includes(e)
  );

  await ctx.prisma.membership.createMany({
    data: existingIds.map((id) => ({
      orgId: input.orgId,
      userId: id,
      role: input.role,
      accepted: false,
    })),
  });

  await ctx.prisma.pendingInvite.createMany({
    data: pendingInvites.map((email) => ({
      email,
      orgId: input.orgId,
      role: input.role,
    })),
  });

  if (input.sendEmail) {
    const org = await ctx.prisma.organization.findUniqueOrThrow({
      where: {
        id: input.orgId,
      },
    });

    const inviter = {
      image: ctx.session.user.image!,
      name: ctx.session.user.name,
      email: ctx.session.user.email!,
    };

    for (const email of pendingInvites) {
      await sendOrganizationInviteEmail(email, {
        orgName: org.name,
        // Onboarding fetches pending invites so we can use the regular signup
        url: `${env.NEXT_PUBLIC_BASE_URL}/auth/signup`,
        inviter,
      });
    }
    for (const email of existingEmails) {
      await sendOrganizationInviteEmail(email, {
        orgName: org.name,
        url: `${env.NEXT_PUBLIC_BASE_URL}/auth/login?callbackUrl=/orgs`,
        inviter,
      });
    }
  }
};

export default inviteMemberHandler;
