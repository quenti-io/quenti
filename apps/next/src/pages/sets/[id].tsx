import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components";
import type { GetServerSidePropsContext } from "@quenti/types";

import { PageWrapper } from "../../common/page-wrapper";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import { ssrInit } from "../../server/ssr";

const SetLoading = dynamic(() => import("../../modules/main/set-loading"), {
  ssr: false,
});
const InternalSet = dynamic(() => import("../../components/internal-set"), {
  ssr: false,
});

const Set = ({
  title,
  description,
}: inferSSRProps<typeof getServerSideProps>) => {
  return (
    <>
      <HeadSeo title={`${title} | Quenti`} description={description} />
      <HydrateSetData placeholder={<SetLoading />}>
        <InternalSet />
      </HydrateSetData>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssr = await ssrInit(ctx);
  const set = await ssr.studySets.byId.fetch({
    studySetId: ctx.query?.id as string,
  });

  return {
    props: {
      id: set.id,
      title: set.title,
      description: set.description,
      user: set.user,
      trpcState: ssr.dehydrate(),
    },
  };
};

Set.PageWrapper = PageWrapper;
Set.getLayout = getLayout;

export default Set;
