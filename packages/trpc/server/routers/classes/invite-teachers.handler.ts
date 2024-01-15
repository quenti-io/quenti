import { inngest } from "@quenti/inngest";

import { TRPCError } from "@trpc/server";

import { getIp } from "../../lib/get-ip";
import { isClassTeacherOrThrow } from "../../lib/queries/classes";
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
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id, "mutation");

  await rateLimitOrThrowMultiple({
    type: RateLimitType.FanOut,
    identifiers: [
      `classes:invite-teachers-user-id-${ctx.session.user.id}`,
      `classes:invite-teachers-ip-${getIp(ctx.req)}`,
    ],
  });

  const class_ = await ctx.prisma.class.findUniqueOrThrow({
    where: {
      id: input.classId,
    },
    select: {
      id: true,
      name: true,
      organization: {
        select: {
          id: true,
          published: true,
          domains: {
            where: {
              type: "Base",
            },
            select: {
              id: true,
              domain: true,
            },
          },
        },
      },
      _count: {
        select: {
          invites: {
            where: {
              type: "Teacher",
            },
          },
          members: {
            where: {
              type: "Teacher",
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  if (
    class_._count.members + class_._count.invites + input.emails.length >
    10
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Cannot invite more than 10 teachers",
    });
  }

  if (class_.organization) {
    const domain = class_.organization.domains[0]!.domain;
    if (!domain)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot invite teachers within unpublished organization",
      });

    const emailDomains = input.emails.map((e) => e.split("@")[1]!);
    if (!emailDomains.every((e) => e === domain)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot invite teachers outside organization domain",
      });
    }
  }

  const existingUsers = await ctx.prisma.user.findMany({
    where: {
      email: {
        in: input.emails,
      },
    },
    select: {
      id: true,
      email: true,
      classes: {
        select: {
          classId: true,
        },
      },
    },
  });

  const existingInvites = await ctx.prisma.pendingClassInvite.findMany({
    where: {
      classId: input.classId,
      email: {
        in: input.emails,
      },
    },
  });

  const invites: { id: string | null; email: string }[] = [];
  const signupEmails: string[] = [];
  const loginEmails: string[] = [];

  for (const email of input.emails) {
    const invite = existingInvites.find((i) => i.email === email);
    if (invite) continue;
    const user = existingUsers.find((u) => u.email === email);
    if (user?.classes.find((c) => c.classId === input.classId)) continue;

    invites.push({
      id: user?.id ?? null,
      email,
    });
    if (user) loginEmails.push(email);
    else signupEmails.push(email);
  }

  await ctx.prisma.pendingClassInvite.createMany({
    data: invites.map(({ id, email }) => ({
      email,
      userId: id,
      classId: input.classId,
      type: "Teacher",
    })),
  });

  if (input.sendEmail) {
    const inviter = {
      id: ctx.session.user.id,
      image: ctx.session.user.image!,
      name: ctx.session.user.name,
      email: ctx.session.user.email!,
    };

    await inngest.send({
      name: "classes/invite-teachers",
      data: {
        class: {
          id: class_.id,
          name: class_.name,
        },
        inviter,
        signupEmails,
        loginEmails,
      },
    });
  }
};

export default inviteTeachersHandler;
