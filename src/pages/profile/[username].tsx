import {
  Container,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue
} from "@chakra-ui/react";
import type { ComponentWithAuth } from "../../components/auth-component";
import { HydrateProfileData } from "../../modules/hydrate-profile-data";
import { FoldersList } from "../../modules/profile/folders-list";
import { ProfileArea } from "../../modules/profile/profile-area";
import { StudySetsList } from "../../modules/profile/study-sets-list";

const UserPage: ComponentWithAuth = () => {
  const borderColor = useColorModeValue("gray.300", "gray.700");

  return (
    <HydrateProfileData>
      <Container maxW="4xl" marginY="10">
        <Stack spacing={12}>
          <ProfileArea />
          <Tabs borderColor={borderColor}>
            <TabList gap="6">
              <Tab px="0" bg="none" fontWeight={600}>
                Study Sets
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
    </HydrateProfileData>
  );
};

UserPage.authenticationEnabled = true;

export default UserPage;

export { getServerSideProps } from "../../components/chakra";
