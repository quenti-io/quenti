import type { Term } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { USERNAME_REGEXP } from "../../../constants/characters";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const foldersRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        username: z.string().max(40).regex(USERNAME_REGEXP),
        slug: z.string(),
        includeTerms: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const folder = await ctx.prisma.folder.findUnique({
        where: {
          userId_slug: {
            userId: user.id,
            slug: input.slug,
          },
        },
        include: {
          studySets: {
            include: {
              studySet: {
                select: {
                  id: true,
                  title: true,
                  user: true,
                  visibility: true,
                  _count: {
                    select: {
                      terms: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isMyFolder = folder.userId === ctx.session.user.id;
      const studySets = folder.studySets.map((s) => s.studySet);
      const studySetsICanSee = studySets.filter((s) => {
        if (s.visibility === "Public") {
          return true;
        }
        if (s.visibility === "Unlisted") {
          // Prevent users from discovering unlisted study sets
          return s.user.id === ctx.session.user.id || isMyFolder;
        }
        if (s.visibility === "Private") {
          return s.user.id === ctx.session.user.id;
        }

        return false;
      });

      if (!!studySets.length && !studySetsICanSee.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No study sets in this folder are visible to you",
        });
      }

      await ctx.prisma.folderExperience.upsert({
        where: {
          userId_folderId: {
            userId: ctx.session.user.id,
            folderId: folder.id,
          },
        },
        create: {
          folderId: folder.id,
          userId: ctx.session.user.id,
          viewedAt: new Date(),
        },
        update: {
          viewedAt: new Date(),
        },
      });

      const experience = await ctx.prisma.folderExperience.findUnique({
        where: {
          userId_folderId: {
            userId: ctx.session.user.id,
            folderId: folder.id,
          },
        },
      });

      if (!experience) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      let terms = new Array<Term>();
      let starredTerms = new Array<string>();

      if (input.includeTerms) {
        const raw = await ctx.prisma.term.findMany({
          where: {
            studySetId: {
              in: studySetsICanSee.map((s) => s.id),
            },
          },
        });

        for (const set of studySetsICanSee) {
          terms = terms.concat(
            raw
              .filter((t) => t.studySetId === set.id)
              .sort((a, b) => a.rank - b.rank)
          );
        }
        terms = terms.map((x, i) => ({ ...x, rank: i }));

        starredTerms = (
          await ctx.prisma.starredTerm.findMany({
            where: {
              userId: ctx.session.user.id,
              termId: {
                in: terms.map((t) => t.id),
              },
            },
          })
        ).map((t) => t.termId);
      }

      return {
        id: folder.id,
        title: folder.title,
        description: folder.description,
        user: {
          id: user.id,
          username: user.username,
          image: user.image,
          verified: user.verified,
        },
        sets: studySetsICanSee.map((s) => ({
          ...s,
          user: {
            id: s.user.id,
            username: s.user.username,
            image: s.user.image,
            verified: s.user.verified,
          },
        })),
        experience: {
          ...experience,
          starredTerms,
        },
        terms,
        editableSets: studySetsICanSee
          .filter((s) => s.user.id === ctx.session.user.id)
          .map((s) => s.id),
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(40),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.folder.create({
        data: {
          title: input.title,
          description: input.description,
          userId: ctx.session.user.id,
          slug: slugify(input.title, { lower: true }),
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
        title: z.string().min(1).max(40),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.prisma.folder.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.folderId,
        },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return await ctx.prisma.folder.update({
        where: {
          id: input.folderId,
        },
        data: {
          title: input.title,
          description: input.description,
          slug: slugify(input.title, { lower: true }),
        },
      });
    }),

  addSets: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
        studySetIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.prisma.folder.findUnique({
        where: {
          id: input.folderId,
        },
      });

      if (!folder || folder.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await ctx.prisma.studySetsOnFolders.createMany({
        data: input.studySetIds.map((studySetId) => ({
          folderId: input.folderId,
          studySetId,
        })),
      });
    }),

  removeSet: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
        studySetId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.prisma.folder.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.folderId,
        },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await ctx.prisma.studySetsOnFolders.delete({
        where: {
          studySetId_folderId: {
            studySetId: input.studySetId,
            folderId: input.folderId,
          },
        },
      });
    }),

  setShuffle: protectedProcedure
    .input(z.object({ folderId: z.string(), shuffle: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.folderExperience.update({
        where: {
          userId_folderId: {
            userId: ctx.session.user.id,
            folderId: input.folderId,
          },
        },
        data: {
          shuffleFlashcards: input.shuffle,
        },
      });
    }),

  starTerm: protectedProcedure
    .input(z.object({ studySetId: z.string(), termId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const experience = await ctx.prisma.studySetExperience.upsert({
        where: {
          userId_studySetId: {
            userId: ctx.session.user.id,
            studySetId: input.studySetId,
          },
        },
        create: {
          userId: ctx.session.user.id,
          studySetId: input.studySetId,
          viewedAt: new Date(),
        },
        update: {},
      });

      await ctx.prisma.starredTerm.create({
        data: {
          termId: input.termId,
          experienceId: experience.id,
          userId: ctx.session.user.id,
        },
      });
    }),
});
