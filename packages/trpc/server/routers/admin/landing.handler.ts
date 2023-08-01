import { env } from "@quenti/env/server";
import type { NonNullableUserContext } from "../../lib/types";

type LandingOptions = {
  ctx: NonNullableUserContext;
};

export const landingHandler = async ({ ctx }: LandingOptions) => {
  const [studySets, terms, studiableTerms, starredTerms, folders, containers] =
    await ctx.prisma.$transaction([
      ctx.prisma.studySet.count(),
      ctx.prisma.term.count(),
      ctx.prisma.studiableTerm.count(),
      ctx.prisma.starredTerm.count(),
      ctx.prisma.folder.count(),
      ctx.prisma.container.count(),
    ]);

  return {
    studySets,
    terms,
    studiableTerms,
    starredTerms,
    folders,
    containers,
    grafanaUrl: env.GRAFANA_DASHBOARD_URL,
  };
};

export default landingHandler;
