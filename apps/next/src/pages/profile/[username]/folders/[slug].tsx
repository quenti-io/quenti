import type { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";
import { prisma } from "@quenti/prisma";

import { LazyWrapper } from "../../../../common/lazy-wrapper";
import { PageWrapper } from "../../../../common/page-wrapper";
import { getLayout } from "../../../../layouts/main-layout";
import type { inferSSRProps } from "../../../../lib/infer-ssr-props";

const Folder404 = dynamic(
  () => import("../../../../modules/folders/folder-404"),
  {
    ssr: false,
  },
);

const InternalFolder = dynamic(
  () => import("../../../../components/internal-folder"),
);

const FolderPage = ({ folder }: inferSSRProps<typeof getServerSideProps>) => {
  if (!folder) return <Folder404 />;

  return (
    <>
      <HeadSeo
        title={folder.title}
        description={folder.description}
        entity={{
          type: "Folder",
          title: folder.title,
          description: folder.description,
          numItems: folder._count.studySets,
          user: {
            username: folder.user.username!,
            image: folder.user.image || "",
          },
        }}
      />
      <LazyWrapper>
        <InternalFolder />
      </LazyWrapper>
    </>
  );
};

FolderPage.PageWrapper = PageWrapper;
FolderPage.getLayout = getLayout;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const username = (ctx.query?.username as string).substring(1);
  const idOrSlug = ctx.query?.slug as string;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return { props: { folder: null } };

  const folder = await prisma.folder.findFirst({
    where: {
      OR: [
        {
          userId: user.id,
          slug: idOrSlug,
        },
        {
          userId: user.id,
          id: idOrSlug,
        },
      ],
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
          studySets: true,
        },
      },
    },
  });

  return {
    props: {
      folder,
    },
  };
};

export default FolderPage;
