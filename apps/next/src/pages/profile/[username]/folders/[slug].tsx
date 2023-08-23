import type { GetServerSidePropsContext } from "next";

import { HeadSeo } from "@quenti/components";
import { prisma } from "@quenti/prisma";

import { Container, Flex, Stack } from "@chakra-ui/react";

import { PageWrapper } from "../../../../common/page-wrapper";
import { WithFooter } from "../../../../components/with-footer";
import { getLayout } from "../../../../layouts/main-layout";
import type { inferSSRProps } from "../../../../lib/infer-ssr-props";
import { Folder404 } from "../../../../modules/folders/folder-404";
import { FolderDescription } from "../../../../modules/folders/folder-description";
import { FolderHeading } from "../../../../modules/folders/folder-heading";
import { FolderLoading } from "../../../../modules/folders/folder-loading";
import { FolderSets } from "../../../../modules/folders/folder-sets";
import { LinkArea } from "../../../../modules/folders/link-area";
import { HydrateFolderData } from "../../../../modules/hydrate-folder-data";

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
            username: folder.user.username,
            image: folder.user.image || "",
          },
        }}
      />
      <HydrateFolderData fallback={<FolderLoading />}>
        <WithFooter>
          <Container maxW="7xl">
            <Stack spacing={12}>
              <Stack spacing="0">
                <FolderHeading />
                <FolderDescription />
              </Stack>
              <Flex
                gap={8}
                flexDir={{ base: "column", lg: "row" }}
                alignItems="stretch"
                w="full"
              >
                <LinkArea />
                <Flex flex="1">
                  <FolderSets />
                </Flex>
              </Flex>
            </Stack>
          </Container>
        </WithFooter>
      </HydrateFolderData>
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
