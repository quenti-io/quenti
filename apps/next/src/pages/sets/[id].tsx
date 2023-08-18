import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components";
import { prisma } from "@quenti/prisma";
import type { GetServerSidePropsContext } from "@quenti/types";

import { PageWrapper } from "../../common/page-wrapper";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import { Set404 } from "../../modules/main/set-404";
import SetLoading from "../../modules/main/set-loading";

const InternalSet = dynamic(() => import("../../components/internal-set"), {
  ssr: false,
  loading: SetLoading,
});

const Set = ({ set }: inferSSRProps<typeof getServerSideProps>) => {
  if (!set) return <Set404 />;

  return (
    <>
      <HeadSeo
        title={set?.title ?? "Not found"}
        description={set?.description ?? undefined}
        entity={
          set
            ? {
                type: "StudySet",
                title: set.title,
                description: set.description,
                numItems: set._count.terms,
                user: {
                  username: set.user.username,
                  image: set.user.image || "",
                },
              }
            : undefined
        }
        nextSeoProps={{
          noindex: !set,
          nofollow: !set,
        }}
      />
      <HydrateSetData placeholder={<SetLoading />}>
        <InternalSet />
      </HydrateSetData>
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
      user: {
        select: {
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

  return {
    props: {
      set,
    },
  };
};

Set.PageWrapper = PageWrapper;
Set.getLayout = getLayout;

export default Set;
