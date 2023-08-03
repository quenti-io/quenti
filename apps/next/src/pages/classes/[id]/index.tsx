import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPointFilled, IconSchool } from "@tabler/icons-react";
import { FolderCard } from "../../../components/folder-card";
import { WithFooter } from "../../../components/with-footer";
import { useClass } from "../../../hooks/use-class";
import { EntityGroup } from "../../../modules/classes/entity-group";
import { plural } from "../../../utils/string";

export default function Classes() {
  const { data } = useClass();

  const bg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  return (
    <WithFooter>
      <Container maxW="5xl">
        <Stack spacing="0">
          <Skeleton w="full" h="32" rounded="2xl" isLoaded={!!data}>
            <Box
              w="full"
              h="32"
              bgGradient="linear(to-tr, blue.400, orange.300)"
              rounded="2xl"
            />
          </Skeleton>
          <Stack
            px={{ base: 0, sm: 6, md: 10 }}
            spacing="8"
            mt="-36px"
            zIndex={10}
          >
            <Center w="88px" h="88px" rounded="3xl" outlineColor={bg} bg={bg}>
              <Skeleton w="72px" h="72px" rounded="2xl" isLoaded={!!data}>
                <Center rounded="2xl" w="72px" h="72px" bg="white" shadow="2xl">
                  <Box color="gray.900">
                    <IconSchool size={36} />
                  </Box>
                </Center>
              </Skeleton>
            </Center>
            <Stack spacing="6">
              <Stack spacing="0">
                <Flex alignItems="center" h="48px">
                  <SkeletonText
                    noOfLines={1}
                    isLoaded={!!data}
                    skeletonHeight="30px"
                  >
                    <Heading>{data?.name || "Classroom name"}</Heading>
                  </SkeletonText>
                </Flex>
                <Flex alignItems="center" h="21px">
                  <SkeletonText
                    noOfLines={1}
                    isLoaded={!!data}
                    skeletonHeight="12px"
                  >
                    <HStack fontSize="sm" color="gray.500" spacing="1">
                      <Text>
                        {plural(data?.studySets?.length || 0, "study set")}
                      </Text>
                      <IconPointFilled size={10} />
                      <Text>
                        {plural(data?.folders?.length || 0, "folder")}
                      </Text>
                    </HStack>
                  </SkeletonText>
                </Flex>
              </Stack>
              <Tabs borderColor={borderColor}>
                <TabList gap="6">
                  <Tab px="0" bg="none" fontWeight={600}>
                    Home
                  </Tab>
                  <Tab px="0" bg="none" fontWeight={600}>
                    Assignments
                  </Tab>
                </TabList>
                <TabPanels mt="6">
                  <TabPanel px="0">
                    <Stack spacing="6">
                      {(!data || !!data.folders.length) && (
                        <EntityGroup heading="Folders" isLoaded={!!data}>
                          {data?.folders?.map((folder) => (
                            <FolderCard
                              key={folder.id}
                              folder={folder}
                              numSets={folder._count.studySets}
                              user={folder.user}
                            />
                          ))}
                        </EntityGroup>
                      )}
                      {(!data || !!data.studySets.length) && (
                        <EntityGroup heading="Study sets" isLoaded={!!data}>
                          {data?.folders?.map((folder) => (
                            <FolderCard
                              key={folder.id}
                              folder={folder}
                              numSets={folder._count.studySets}
                              user={folder.user}
                            />
                          ))}
                        </EntityGroup>
                      )}
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </WithFooter>
  );
}
