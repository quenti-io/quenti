import type { GetServerSidePropsContext } from "next";

import { db, eq } from "@quenti/drizzle";
import {
  entityShare as entityShareTable,
  folder as folderTable,
} from "@quenti/drizzle/schema";

import { PageWrapper } from "../../common/page-wrapper";
import { Generic404 } from "../../components/generic-404";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";
import { Folder404 } from "../../modules/folders/folder-404";

export const runtime = "experimental-edge";

const ShareResolver = ({
  entity,
}: inferSSRProps<typeof getServerSideProps>) => {
  if (entity?.type == "Folder") return <Folder404 />;
  return <Generic404 />;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!db) return { props: { entity: null } };

  ctx.res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  const id = ctx.query?.id as string;

  const entityShare = await db.query.entityShare.findFirst({
    where: eq(entityShareTable.id, id.substring(1)),
  });

  if (!entityShare) return { props: { entity: null } };

  if (entityShare.type == "StudySet") {
    return {
      redirect: {
        permanent: false,
        destination: `/${entityShare.entityId}`,
      },
    };
  } else {
    const folder = await db.query.folder.findFirst({
      where: eq(folderTable.id, entityShare.entityId),
      columns: {
        id: true,
        slug: true,
      },
      with: {
        user: {
          columns: {
            username: true,
          },
        },
      },
    });

    if (!folder) return { props: { entity: { type: entityShare.type } } };

    return {
      redirect: {
        permanent: false,
        destination: `/@${folder.user.username}/folders/${
          folder.slug ?? folder.id
        }`,
      },
    };
  }
};

ShareResolver.PageWrapper = PageWrapper;
ShareResolver.getLayout = getLayout;

export default ShareResolver;
