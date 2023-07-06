import { z } from "zod";
import { MAX_TITLE } from "../common/constants";
import { createTRPCRouter, teacherProcedure } from "../trpc";

export const organizationsRouter = createTRPCRouter({
  getBelonging: teacherProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        members: {
          take: 5,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
  }),

  get: teacherProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.prisma.organization.findFirst({
      where: {
        slug: input,
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                email: true,
                // TODO: include classes
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
  }),

  create: teacherProcedure
    .input(
      z.object({
        name: z.string().min(1).max(MAX_TITLE),
        slug: z.string().min(1).max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.organization.create({
        data: {
          name: input.name,
          slug: input.slug,
        },
      });
    }),
});
