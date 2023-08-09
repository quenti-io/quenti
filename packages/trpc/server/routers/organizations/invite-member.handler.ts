import { sendOrganizationInviteEmail } from "@quenti/emails";
import { env } from "@quenti/env/client";
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

  let existingUsers = await ctx.prisma.user.findMany({
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
    },
  });

  const existingInvites = await ctx.prisma.pendingOrganizationInvite.findMany({
    where: {
      orgId: input.orgId,
    },
  });

  existingUsers = existingUsers.filter((u) => !u.organization);
  const existingEmails = existingUsers.map((u) => u.email);
  const existingInviteEmails = existingInvites.map((i) => i.email);
  const pendingInvites = input.emails.filter(
    (e) => !existingInviteEmails.includes(e)
  );

  const invites = (
    existingUsers as { email: string; id: string | null }[]
  ).concat(pendingInvites.map((e) => ({ email: e, id: null })));

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
      image: ctx.session.user.image!,
      name: ctx.session.user.name,
      email: ctx.session.user.email!,
    };

    for (const email of pendingInvites) {
      await sendOrganizationInviteEmail(email, {
        orgName: org.name,
        // Onboarding fetches the pending invite so we can use the regular signup flow
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
