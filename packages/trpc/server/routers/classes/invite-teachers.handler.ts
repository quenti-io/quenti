import { sendClassInviteEmail } from "@quenti/emails";
import { env } from "@quenti/env/client";
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
  await isClassTeacherOrThrow(input.classId, ctx.session.user.id);

  await rateLimitOrThrowMultiple({
    type: RateLimitType.FanOut,
    identifiers: [
      `classes:invite-teachers-user-id-${ctx.session.user.id}`,
      `classes:invite-teachers-ip-${getIp(ctx.req)}`,
    ],
  });

  const existingInvites = await ctx.prisma.pendingClassInvite.findMany({
    where: {
      classId: input.classId,
    },
  });

  const pendingInvites = input.emails.filter(
    (e) => !existingInvites.find((i) => i.email === e)
  );

  await ctx.prisma.pendingClassInvite.createMany({
    data: pendingInvites.map((email) => ({
      email,
      classId: input.classId,
    })),
  });

  if (input.sendEmail) {
    const class_ = await ctx.prisma.class.findUniqueOrThrow({
      where: {
        id: input.classId,
      },
    });

    const inviter = {
      image: ctx.session.user.image!,
      name: ctx.session.user.name,
      email: ctx.session.user.email!,
    };

    for (const email of pendingInvites) {
      await sendClassInviteEmail(email, {
        className: class_.name,
        url: `${env.NEXT_PUBLIC_BASE_URL}/auth/login?callbackUrl=/classes/${class_.id}/join`,
        inviter,
      });
    }
  }
};

export default inviteTeachersHandler;
