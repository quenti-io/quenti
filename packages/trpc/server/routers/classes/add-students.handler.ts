import { TRPCError } from "@trpc/server";
import { isClassTeacherOrThrow } from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TAddStudentsSchema } from "./add-students.schema";

type AddStudentsOptions = {
  ctx: NonNullableUserContext;
  input: TAddStudentsSchema;
};

export const addStudentsHandler = async ({
  ctx,
  input,
}: AddStudentsOptions) => {
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  const class_ = await ctx.prisma.class.findUniqueOrThrow({
    where: {
      id: input.classId,
    },
    select: {
      id: true,
      organization: {
        select: {
          published: true,
          domains: {
            select: {
              domain: true,
            },
          },
        },
      },
    },
  });

  if (!class_.organization?.published) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "Cannot manually add students to a class not bound to an organization",
    });
  }

  const domains = class_.organization.domains.map((d) => d.domain);
  if (!input.emails.every((e) => domains.includes(e.split("@")[1]!))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Emails must be within the organization's domain",
    });
  }

  const section = await ctx.prisma.section.findUnique({
    where: {
      id: input.sectionId,
    },
  });
  if (!section) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Section does not exist",
    });
  }

  const existingusers = await ctx.prisma.user.findMany({
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

  const memberships: { userId: string; email: string }[] = [];
  const inviteEmails: string[] = [];

  for (const email of input.emails) {
    const invite = existingInvites.find((i) => i.email === email);
    if (invite) continue;
    const user = existingusers.find((u) => u.email === email);
    if (user?.classes.find((c) => c.classId === input.classId)) continue;

    if (user) {
      memberships.push({ userId: user.id, email });
    } else {
      inviteEmails.push(email);
    }
  }

  await ctx.prisma.pendingClassInvite.createMany({
    data: inviteEmails.map((email) => ({
      classId: input.classId,
      sectionId: input.sectionId,
      type: "Student",
      email,
    })),
  });

  await ctx.prisma.classMembership.createMany({
    data: memberships.map(({ userId, email }) => ({
      userId,
      email,
      classId: input.classId,
      type: "Student",
      sectionId: input.sectionId,
    })),
  });
};

export default addStudentsHandler;
