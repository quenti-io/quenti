import { TRPCError } from "@trpc/server";
import {
  isOrganizationAdmin,
  isOrganizationOwner,
} from "../../../lib/queries/organizations";
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
    for (const email of pendingInvites.concat(existingEmails)) {
      // TODO: Send email
      console.log(`Sending email to ${email}`);
    }
  }
};

export default inviteMemberHandler;
