import { prisma } from "@quenti/prisma";
import type { UserType } from "@quenti/prisma/client";

export const getBelongingClasses = async (userId: string, type: UserType) => {
  const classes = await prisma.classMembership.findMany({
    where: {
      userId,
    },
    include: {
      class: {
        include: {
          _count: {
            ...(type == "Teacher"
              ? {
                  select: {
                    sections: true,
                    members: {
                      where: {
                        type: "Student",
                      },
                    },
                  },
                }
              : {
                  select: {
                    folders: true,
                    studySets: true,
                  },
                }),
          },
        },
      },
    },
  });

  return classes.map((membership) => ({
    viewedAt: membership.viewedAt,
    ...membership.class,
    _count: {
      ...(membership.class._count as {
        folders?: number;
        studySets?: number;
        sections?: number;
        members?: number;
      }),
    },
  }));
};
