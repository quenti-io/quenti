import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components";
import type { GetServerSidePropsContext } from "@quenti/types";

import { PageWrapper } from "../../common/page-wrapper";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import SetLoading from "../../modules/main/set-loading";
import { ssrInit } from "../../server/ssr";

const InternalSet = dynamic(() => import("../../components/internal-set"), {
  ssr: false,
  loading: SetLoading,
});

const Set = ({
  title,
  description,
  terms,
  user,
}: inferSSRProps<typeof getServerSideProps>) => {
  return (
    <>
      <HeadSeo
        title={title}
        description={description}
        entity={{
          type: "StudySet",
          title,
          description,
          numItems: terms,
          user: {
            image: user.image,
            username: user.username,
          },
        }}
      />
      <HydrateSetData placeholder={<SetLoading />}>
        <InternalSet />
      </HydrateSetData>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssr = await ssrInit(ctx);
  const set = await ssr.studySets.getPublic.fetch({
    studySetId: ctx.query?.id as string,
  });

  return {
    props: {
      id: set.id,
      title: set.title,
      description: set.description,
      user: set.user,
      terms: set.terms.length,
      trpcState: ssr.dehydrate(),
    },
  };
};

Set.PageWrapper = PageWrapper;
Set.getLayout = getLayout;

export default Set;
