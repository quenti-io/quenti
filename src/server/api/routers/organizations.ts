import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { DISALLOWED_ORG_SLUGS } from "../common/constants";
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
          )
          .refine((slug) => !DISALLOWED_ORG_SLUGS.includes(slug)),
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

  update: teacherProcedure
    .input(
      z.object({
        id: z.string().cuid2(),
        name: z.string(),
        slug: z
          .string()
          .transform((slug) =>
            slugify(slug.trim(), { lower: true, strict: true })
          )
          .refine((slug) => !DISALLOWED_ORG_SLUGS.includes(slug)),
        icon: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.prisma.organization.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: {
            where: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      if (!org.members[0]) throw new TRPCError({ code: "FORBIDDEN" });

      const role = org.members[0].role;
      if (role !== "Owner" && role !== "Admin")
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "not_admin_or_owner",
        });

      const existing = await ctx.prisma.organization.findUnique({
        where: {
          slug: input.slug,
        },
      });

      if (existing && existing.id !== input.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "slug_conflict",
        });
      }

      return await ctx.prisma.organization.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          slug: input.slug,
          icon: input.icon,
        },
      });
    }),

  delete: teacherProcedure
    .input(z.string().cuid2())
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.prisma.organization.findUnique({
        where: {
          id: input,
        },
        include: {
          members: {
            where: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      if (!org.members[0]) throw new TRPCError({ code: "FORBIDDEN" });

      const role = org.members[0].role;
      if (role !== "Owner")
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "not_owner",
        });

      await ctx.prisma.organization.delete({
        where: {
          id: input,
        },
      });
    }),
});
