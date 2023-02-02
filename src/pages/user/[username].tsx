import {
  Avatar,
  Box,
  Container,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue
} from "@chakra-ui/react";
import type { StudySetVisibility } from "@prisma/client";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { visibilityIcon } from "../../common/visibility-icon";
import type { ComponentWithAuth } from "../../components/auth-component";
import { Loading } from "../../components/loading";
import { api } from "../../utils/api";
import { plural } from "../../utils/string";

const UserPage: ComponentWithAuth = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const profile = api.profile.get.useQuery(username.substring(1));

  const borderColor = useColorModeValue("gray.300", "gray.700");

  if (!profile.data) return <Loading />;

  return (
    <Container maxW="4xl" marginTop="10">
      <Stack spacing={12}>
        <HStack gap={4}>
          <Avatar src={profile.data.image!} />
          <HStack gap={0}>
            <Heading>{profile.data.username}</Heading>
            <Box color="blue.300">
              <Tooltip label="Verified">
                <IconDiscountCheck aria-label="Verified" />
              </Tooltip>
            </Box>
          </HStack>
        </HStack>
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
              <Stack spacing={4}>
                {profile.data.studySets.map((x) => (
                  <StudySetLink
                    id={x.id}
                    title={x.title}
                    visibility={x.visibility}
                    numTerms={x._count.terms}
                  />
                ))}
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
};

interface StudySetLinkProps {
  id: string;
  title: string;
  numTerms: number;
  visibility: StudySetVisibility;
}

const StudySetLink: React.FC<StudySetLinkProps> = ({
  id,
  title,
  numTerms,
  visibility,
}) => {
  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <LinkBox
      as="article"
      h="full"
      rounded="md"
      p="4"
      bg={linkBg}
      borderColor={linkBorder}
      borderWidth="2px"
      shadow="md"
      transition="all ease-in-out 150ms"
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
    >
      <Stack spacing={2}>
        <Text fontSize="sm">{plural(numTerms, "term")}</Text>
        <HStack>
          <Heading size="md">
            <LinkOverlay href={`/${id}`}>{title}</LinkOverlay>
          </Heading>
          {visibility !== "Public" ? (
            <Box color="gray.500">{visibilityIcon(visibility, 18)}</Box>
          ) : (
            ""
          )}
        </HStack>
      </Stack>
    </LinkBox>
  );
};

UserPage.authenticationEnabled = true;

export default UserPage;

export { getServerSideProps } from "../../components/chakra";
