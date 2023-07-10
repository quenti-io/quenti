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
    const organizations = await ctx.prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        members: {
          where: {
            userId: ctx.session.user.id,
          },
          select: {
            accepted: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return organizations.map((org) => ({
      ...org,
      members: undefined,
      accepted: org.members[0]!.accepted,
    }));
  }),

  get: teacherProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const org = await ctx.prisma.organization.findFirst({
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
        inviteToken: {
          select: {
            token: true,
            expires: true,
            expiresInDays: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!org) throw new TRPCError({ code: "NOT_FOUND" });

    return org;
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

      return token;
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

  acceptInvite: teacherProcedure
    .input(
      z.object({
        orgId: z.string().cuid2(),
        accept: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.accept) {
        await ctx.prisma.membership.update({
          where: {
            userId_orgId: {
              userId: ctx.session.user.id,
              orgId: input.orgId,
            },
          },
          data: {
            accepted: true,
          },
        });
      } else {
        await ctx.prisma.membership.delete({
          where: {
            userId_orgId: {
              userId: ctx.session.user.id,
              orgId: input.orgId,
            },
          },
        });
      }
    }),

  editMemberRole: teacherProcedure
    .input(
      z.object({
        orgId: z.string().cuid2(),
        userId: z.string().cuid2(),
        role: z.nativeEnum(MembershipRole),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.prisma.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          orgId: input.orgId,
          accepted: true,
          OR: [{ role: "Admin" }, { role: "Owner" }],
        },
      });
      if (!membership) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (membership.role == "Member") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Must be an admin to edit member roles",
        });
      }
      if (input.userId == ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot change your own role",
        });
      }

      const members = await ctx.prisma.membership.findMany({
        where: {
          orgId: input.orgId,
        },
      });

      const target = members.find((m) => m.userId === input.userId);
      if (!target) throw new TRPCError({ code: "NOT_FOUND" });

      if (membership.role == "Admin" && input.role == "Owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Must be an owner to change a user to owner",
        });
      }

      await ctx.prisma.membership.update({
        where: {
          userId_orgId: {
            userId: input.userId,
            orgId: input.orgId,
          },
        },
        data: {
          role: input.role,
        },
      });
    }),

  removeMember: teacherProcedure
    .input(
      z.object({
        orgId: z.string().cuid2(),
        userId: z.string().cuid2(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.prisma.membership.findFirst({
        where: {
          userId: ctx.session.user.id,
          orgId: input.orgId,
          accepted: true,
          OR: [{ role: "Admin" }, { role: "Owner" }],
        },
      });
      if (!membership) throw new TRPCError({ code: "UNAUTHORIZED" });

      const members = await ctx.prisma.membership.findMany({
        where: {
          orgId: input.orgId,
        },
      });

      const targetMembership = members.find((m) => m.userId === input.userId);
      if (!targetMembership) throw new TRPCError({ code: "NOT_FOUND" });

      const owners = members.filter((m) => m.role === "Owner");

      if (membership.userId == input.userId) {
        if (membership.role == "Owner" && owners.length == 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Cannot remove yourself as the only owner of an organization",
          });
        }
      }

      if (membership.role == "Admin" && targetMembership.role == "Owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Must be an owner to remove an owner",
        });
      }

      await ctx.prisma.membership.delete({
        where: {
          userId_orgId: {
            userId: input.userId,
            orgId: input.orgId,
          },
        },
      });
    }),
});
