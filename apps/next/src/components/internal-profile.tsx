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

import { HydrateProfileData } from "../modules/hydrate-profile-data";
import { FoldersList } from "../modules/profile/folders-list";
import { ProfileArea } from "../modules/profile/profile-area";
import { ProfileLoading } from "../modules/profile/profile-loading";
import { StudySetsList } from "../modules/profile/study-sets-list";
import { WithFooter } from "./with-footer";

const InternalProfile = () => {
  const borderColor = useColorModeValue("gray.300", "gray.700");

  return (
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
  );
};

export default InternalProfile;
