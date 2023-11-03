import type { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";
import { prisma } from "@quenti/prisma";

import { LazyWrapper } from "../../common/lazy-wrapper";
import { PageWrapper } from "../../common/page-wrapper";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";

const InternalProfile = dynamic(
  () => import("../../components/internal-profile"),
);

const UserPage = ({ user }: inferSSRProps<typeof getServerSideProps>) => {
  return (
    <>
      {user && <HeadSeo title={user.name ?? user.username} profile={user} />}
      <LazyWrapper>
        <InternalProfile />
      </LazyWrapper>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const _username = ctx.query?.username as string;
  const username = _username.substring(1);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      image: true,
      displayName: true,
      name: true,
      verified: true,
    },
  });

  return {
    props: {
      user: user
        ? {
            id: user.id,
            username: user.username!,
            image: user.image ?? "",
            name: user.displayName ? user.name : null,
            verified: user.verified,
          }
        : null,
    },
  };
};

UserPage.PageWrapper = PageWrapper;
UserPage.getLayout = getLayout;

export default UserPage;
