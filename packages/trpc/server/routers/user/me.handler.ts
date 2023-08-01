import type { NonNullableUserContext } from "../../lib/types";

type MeOptions = {
  ctx: NonNullableUserContext;
};

export const meHandler = async ({ ctx }: MeOptions) => {
  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          icon: true,
          domain: {
            select: {
              id: true,
              requestedDomain: true,
              domain: true,
            },
          },
        },
      },
      organizations: {
        select: {
          id: true,
          accepted: true,
          role: true,
          organization: {
            select: {
              id: true,
              name: true,
              icon: true,
              domain: {
                select: {
                  id: true,
                  requestedDomain: true,
                  domain: true,
                },
              },
              _count: {
                select: {
                  members: true,
                  users: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    image: user.image,
    organization: user.organization,
    memberships: user.organizations,
    type: user.type,
  };
};

export default meHandler;
