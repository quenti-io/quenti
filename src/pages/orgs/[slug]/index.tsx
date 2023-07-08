import {
  Avatar,
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { WithFooter } from "../../../components/with-footer";
import { api } from "../../../utils/api";

export default function OrganizationsPage() {
  const router = useRouter();
  const slug = router.query.slug as string;

  const borderColor = useColorModeValue("gray.300", "gray.700");
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  const { data: org } = api.organizations.get.useQuery(slug, {
    enabled: !!slug,
  });

  return (
    <WithFooter>
      <Container maxW="6xl" overflow="hidden">
        <Stack spacing="10">
          <HStack spacing="6">
            <Skeleton isLoaded={!!org} fitContent rounded="full">
              <Avatar src="/avatars/quizlet.png" size="lg" />
            </Skeleton>
            <Stack spacing="0" flex="1" overflow="hidden">
              <Flex h="43.2px" alignItems="center" w="full">
                <SkeletonText
                  isLoaded={!!org}
                  fitContent
                  noOfLines={1}
                  skeletonHeight="36px"
                  maxW="full"
                >
                  <HStack w="full">
                    <Heading
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      maxW="full"
                    >
                      {org?.name || "Loading..."}
                    </Heading>
                    <Box color="blue.300">
                      <Tooltip label="Verified Organization">
                        <IconDiscountCheck aria-label="Verified" />
                      </Tooltip>
                    </Box>
                  </HStack>
                </SkeletonText>
              </Flex>
              <SkeletonText
                noOfLines={1}
                fitContent
                w="max-content"
                isLoaded={!!org}
                skeletonHeight="10px"
              >
                <Text fontSize="sm" color={mutedColor}>
                  {org?.slug || "loading"}
                </Text>
              </SkeletonText>
            </Stack>
          </HStack>
          <Tabs borderColor={borderColor} size="sm">
            <TabList gap="10">
              <Tab px="0" bg="none" fontWeight={600} pb="3">
                Organization
              </Tab>
              <Tab px="0" bg="none" fontWeight={600} pb="3">
                Members
              </Tab>
              <Tab px="0" bg="none" fontWeight={600} pb="3">
                Settings
              </Tab>
            </TabList>
          </Tabs>
        </Stack>
      </Container>
    </WithFooter>
  );
}
