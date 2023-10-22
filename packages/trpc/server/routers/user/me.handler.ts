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
          logoUrl: true,
          logoHash: true,
          domains: {
            select: {
              id: true,
              type: true,
              requestedDomain: true,
              domain: true,
            },
          },
        },
      },
      orgMembership: {
        select: {
          id: true,
          role: true,
          metadata: true,
          organization: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              logoHash: true,
            },
          },
        },
      },
      orgInvites: {
        select: {
          organization: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              logoHash: true,
              published: true,
              _count: {
                select: {
                  members: true,
                  users: {
                    where: {
                      type: "Student",
                    },
                  },
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
    orgInvites: user.orgInvites,
    orgMembership: user.orgMembership,
    type: user.type,
  };
};

export default meHandler;
