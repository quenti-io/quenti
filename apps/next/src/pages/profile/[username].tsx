import type { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";
import { db, eq } from "@quenti/drizzle";
import { user as userTable } from "@quenti/drizzle/schema";

import { LazyWrapper } from "../../common/lazy-wrapper";
import { PageWrapper } from "../../common/page-wrapper";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";

const InternalProfile = dynamic(
  () => import("../../components/internal-profile"),
);

export const runtime = "experimental-edge";

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
  if (!db) return { props: { user: null } };

  const _username = ctx.query?.username as string;
  const username = _username.substring(1);

  const user = await db?.query.user.findFirst({
    where: eq(userTable.username, username),
    columns: {
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
