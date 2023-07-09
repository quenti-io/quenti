import { MembershipRole, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import slugify from "slugify";
import { z } from "zod";
import {
  isOrganizationAdmin,
  isOrganizationOwner,
} from "../../../lib/server/queries/organizations";
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
      });

      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      if (!(await isOrganizationAdmin(ctx.session.user.id, org.id)))
        throw new TRPCError({ code: "UNAUTHORIZED" });

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
      });

      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      if (!(await isOrganizationOwner(ctx.session.user.id, org.id)))
        throw new TRPCError({ code: "UNAUTHORIZED" });

      await ctx.prisma.organization.delete({
        where: {
          id: input,
        },
      });
    }),

  createInvite: teacherProcedure
    .input(z.string().cuid2())
    .mutation(async ({ ctx, input }) => {
      if (!(await isOrganizationAdmin(ctx.session.user.id, input)))
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const token = randomBytes(32).toString("hex");
      await ctx.prisma.verificationToken.create({
        data: {
          identifier: "",
          token,
          expires: new Date(),
          organizationId: input,
        },
      });
    }),

  setInviteExpiration: teacherProcedure
    .input(
      z.object({
        token: z.string(),
        expiresInDays: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await ctx.prisma.verificationToken.findFirst({
        where: {
          token: input.token,
        },
        select: {
          organizationId: true,
        },
      });

      if (!token) throw new TRPCError({ code: "NOT_FOUND" });
      if (
        !token.organizationId ||
        !(await isOrganizationAdmin(ctx.session.user.id, token.organizationId))
      )
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const oneDay = 1000 * 60 * 60 * 24;
      const expires = new Date(
        Date.now() + (input.expiresInDays ?? 0) * oneDay
      );

      await ctx.prisma.verificationToken.update({
        where: {
          token: input.token,
        },
        data: {
          expires,
          expiresInDays: input.expiresInDays,
        },
      });
    }),

  acceptToken: teacherProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = await ctx.prisma.verificationToken.findFirst({
        where: {
          token: input.token,
          OR: [{ expiresInDays: null }, { expires: { gte: new Date() } }],
        },
        include: {
          organization: true,
        },
      });

      if (!token)
        throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found" });
      if (!token.organizationId || !token.organization)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Token is not associated with a team",
        });

      try {
        await ctx.prisma.membership.create({
          data: {
            orgId: token.organizationId,
            userId: ctx.session.user.id,
            role: MembershipRole.Member,
            accepted: false,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Already a member of this team",
            });
          }
        } else throw e;
      }

      return token.organization.name;
    }),
});
