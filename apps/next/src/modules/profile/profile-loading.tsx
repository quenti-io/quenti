import {
  Container,
  Flex,
  SkeletonText,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";

import { WithFooter } from "../../components/with-footer";
import { ProfileArea } from "./profile-area";
import { StudySetsList } from "./study-sets-list";

export const ProfileLoading = () => {
  const borderColor = useColorModeValue("gray.300", "gray.700");

  return (
    <WithFooter>
      <Container maxW="4xl">
        <Stack spacing={12}>
          <ProfileArea.Skeleton />
          <Tabs borderColor={borderColor}>
            <TabList gap="6">
              <Tab px="0" bg="none" fontWeight={600} h="42px">
                <Flex alignItems="center" h="21px">
                  <SkeletonText noOfLines={1} skeletonHeight="4">
                    Study sets
                  </SkeletonText>
                </Flex>
              </Tab>
              <Tab px="0" bg="none" fontWeight={600} h="42px">
                <Flex alignItems="center" h="21px">
                  <SkeletonText noOfLines={1} skeletonHeight="4">
                    Folders
                  </SkeletonText>
                </Flex>
              </Tab>
            </TabList>
            <TabPanels mt="10">
              <TabPanel px="0">
                <StudySetsList.Skeleton />
              </TabPanel>
              <TabPanel px="0">
                <StudySetsList.Skeleton />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Container>
    </WithFooter>
  );
};
