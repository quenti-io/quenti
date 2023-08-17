import type { GetServerSidePropsContext } from "next";
import { type AxiomAPIRequest, log } from "next-axiom";
import superjson from "superjson";

import { getServerAuthSession } from "@quenti/auth";
import { createServerSideHelpers } from "@quenti/trpc/react/server";
import { createContext } from "@quenti/trpc/server/context";
import { appRouter } from "@quenti/trpc/server/root";

export const ssrInit = async (context: GetServerSidePropsContext) => {
  const ctx = createContext({
    ...context,
    req: { ...context.req, log } as AxiomAPIRequest,
  });
  const session = await getServerAuthSession(context);

  const ssr = createServerSideHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: {
      ...ctx,
      session: session ?? null,
    },
  });

  await ssr.user.me.prefetch();

  return ssr;
};
