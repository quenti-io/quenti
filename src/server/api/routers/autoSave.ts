import { createTRPCRouter, protectedProcedure } from "../trpc";
import { input, z } from "zod";
import { nanoid } from "nanoid";

export const autoSaveRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.setAutoSave.upsert({
      where: {
        userId: ctx.session.user.id,
      },
      update: {},
      create: {
        title: "",
        description: "",
        userId: ctx.session.user.id,
        autoSaveTermOrder: [],
        autoSaveTerms: {},
      },
      include: {
        autoSaveTerms: true,
      },
    });
  }),

  save: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        terms: z.array(
          z.object({
            word: z.string(),
            definition: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const terms = input.terms.map((t) => ({ ...t, id: nanoid() }));

      return await ctx.prisma.setAutoSave.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        update: {
          title: input.title,
          description: input.description,
          userId: ctx.session.user.id,
          autoSaveTermOrder: terms.map((term) => term.id),
          autoSaveTerms: {
            deleteMany: { setAutoSaveId: ctx.session.user.id },
            createMany: {
              data: terms.map((term) => ({
                id: term.id,
                definition: term.definition,
                word: term.word,
              })),
            },
          },
        },
        create: {
          title: input.title,
          description: input.description,
          userId: ctx.session.user.id,
          autoSaveTermOrder: terms.map((term) => term.id),
          autoSaveTerms: {
            createMany: {
              data: terms.map((term) => ({
                id: term.id,
                definition: term.definition,
                word: term.word,
              })),
            },
          },
        },
      });
    }),
});
