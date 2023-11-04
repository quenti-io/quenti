import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";
import { prisma } from "@quenti/prisma";
import type { GetServerSidePropsContext } from "@quenti/types";

import { LazyWrapper } from "../../common/lazy-wrapper";
import { PageWrapper } from "../../common/page-wrapper";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";

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
            numItems: set._count.terms,
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
  const set = await prisma.studySet.findUnique({
    where: {
      id: ctx.query?.id as string,
    },
    select: {
      id: true,
      title: true,
      description: true,
      visibility: true,
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: {
          terms: true,
        },
      },
    },
  });

  if (!set) return { props: { set: null } };
  if (set.visibility == "Private") return { props: { set: null } };

  return {
    props: {
      set,
    },
  };
};

Set.PageWrapper = PageWrapper;
Set.getLayout = getLayout;

export default Set;
