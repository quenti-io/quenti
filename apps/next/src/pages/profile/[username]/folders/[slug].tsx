import type { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

import { HeadSeo } from "@quenti/components/head-seo";
import { and, db, eq, or, sql } from "@quenti/drizzle";
import { folder, studySetsOnFolders, user } from "@quenti/drizzle/schema";

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

export const runtime = "experimental-edge";

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
          numItems: folder.studySets,
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
  if (!db) return { props: { set: null } };

  const username = (ctx.query?.username as string).substring(1);
  const idOrSlug = ctx.query?.slug as string;

  const target = await db.query.user.findFirst({
    where: eq(user.username, username),
  });

  if (!target) return { props: { folder: null } };

  const targetFolder = await db.query.folder.findFirst({
    where: and(
      eq(folder.userId, target.id),
      or(eq(folder.id, idOrSlug), eq(folder.slug, idOrSlug)),
    ),
    columns: {
      id: true,
      title: true,
      description: true,
    },
    with: {
      user: {
        columns: {
          username: true,
          image: true,
        },
      },
    },
  });

  if (!targetFolder) return { props: { folder: null } };

  const { count } = (
    await db
      .select({
        count: sql<number>`cast(count(${studySetsOnFolders.studySetId}) as unsigned)`,
      })
      .from(studySetsOnFolders)
      .where(eq(studySetsOnFolders.folderId, targetFolder.id))
  )[0]!;

  return {
    props: {
      folder: { ...targetFolder, studySets: count },
    },
  };
};

export default FolderPage;
