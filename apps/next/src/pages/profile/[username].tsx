import type { GetServerSidePropsContext } from "next";

import { HeadSeo } from "@quenti/components";
import { prisma } from "@quenti/prisma";

import {
  Container,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";

import { LazyWrapper } from "../../common/lazy-wrapper";
import { PageWrapper } from "../../common/page-wrapper";
import { WithFooter } from "../../components/with-footer";
import { getLayout } from "../../layouts/main-layout";
import type { inferSSRProps } from "../../lib/infer-ssr-props";
import { HydrateProfileData } from "../../modules/hydrate-profile-data";
import { FoldersList } from "../../modules/profile/folders-list";
import { ProfileArea } from "../../modules/profile/profile-area";
import { ProfileLoading } from "../../modules/profile/profile-loading";
import { StudySetsList } from "../../modules/profile/study-sets-list";

const UserPage = ({ user }: inferSSRProps<typeof getServerSideProps>) => {
  const borderColor = useColorModeValue("gray.300", "gray.700");

  return (
    <>
      {user && <HeadSeo title={user.name ?? user.username} profile={user} />}
      <LazyWrapper>
        <HydrateProfileData fallback={<ProfileLoading />}>
          <WithFooter>
            <Container maxW="4xl">
              <Stack spacing={12}>
                <ProfileArea />
                <Tabs borderColor={borderColor}>
                  <TabList gap="6">
                    <Tab px="0" bg="none" fontWeight={600}>
                      Study sets
                    </Tab>
                    <Tab px="0" bg="none" fontWeight={600}>
                      Folders
                    </Tab>
                  </TabList>
                  <TabPanels mt="10">
                    <TabPanel px="0">
                      <StudySetsList />
                    </TabPanel>
                    <TabPanel px="0">
                      <FoldersList />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>
            </Container>
          </WithFooter>
        </HydrateProfileData>
      </LazyWrapper>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  ctx.res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

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
            username: user.username,
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
