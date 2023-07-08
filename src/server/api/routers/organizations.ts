import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
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
        name: z.string(),
        slug: z
          .string()
          .transform((slug) =>
            slugify(slug.trim(), { lower: true, strict: true })
          ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.organization.findUnique({
        where: {
          slug: input.slug,
        },
      });

      if (existing)
        throw new TRPCError({
          code: "CONFLICT",
          message: "slug_conflict",
        });

      return await ctx.prisma.organization.create({
        data: {
          name: input.name,
          slug: input.slug,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "Owner",
              accepted: true,
            },
          },
        },
      });
    }),
});
