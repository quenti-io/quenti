import { z } from "zod";
import { createTRPCRouter, devProcedure } from "../trpc";
import { UserType } from "@quenti/prisma/client";

export const devRouter = createTRPCRouter({
  setAccountType: devProcedure
    .input(z.nativeEnum(UserType))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { type: input },
      });
    }),
});
