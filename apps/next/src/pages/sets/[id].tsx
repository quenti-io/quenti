import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";
import { db, eq, sql } from "@quenti/drizzle";
import { studySet, term } from "@quenti/drizzle/schema";
import type { GetServerSidePropsContext } from "@quenti/types";

import { LazyWrapper } from "../../common/lazy-wrapper";
import { PageWrapper } from "../../common/page-wrapper";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";

export const runtime = "experimental-edge";

const InternalSet = dynamic(() => import("../../components/internal-set"));

const Set = ({ set }: inferSSRProps<typeof getServerSideProps>) => {
  return (
    <>
      {set && (
        <HeadSeo
          title={set?.title ?? "Not found"}
          description={set?.description ?? undefined}
          entity={{
            type: "StudySet",
            title: set.title,
            description: set.description,
            numItems: set.terms,
            user: {
              username: set.user.username!,
              image: set.user.image || "",
            },
          }}
          nextSeoProps={{
            noindex: set.visibility != "Public",
            nofollow: set.visibility != "Public",
          }}
        />
      )}
      <LazyWrapper>
        <InternalSet />
      </LazyWrapper>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!db) return { props: { set: null } };

  const set = await db.query.studySet.findFirst({
    where: eq(studySet.id, ctx.query?.id as string),
    columns: {
      id: true,
      title: true,
      description: true,
      visibility: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });

  if (!set || set.visibility == "Private") return { props: { set: null } };

  const { count } = (
    await db
      .select({
        count: sql<number>`cast(count(${term.id}) as unsigned)`,
      })
      .from(term)
      .where(eq(term.studySetId, set.id))
  )[0]!;

  return {
    props: {
      set: { ...set, terms: count },
    },
  };
};

Set.PageWrapper = PageWrapper;
Set.getLayout = getLayout;

export default Set;
