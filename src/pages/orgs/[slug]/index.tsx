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
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { WithFooter } from "../../../components/with-footer";
import { OrganizationTab } from "../../../modules/organizations/organization-tab";
import { api } from "../../../utils/api";
import { organizationIcon } from "../../../utils/icons";
import { SettingsTab } from "../../../modules/organizations/settings-tab";

export default function OrganizationsPage() {
  const router = useRouter();
  const slug = router.query.slug as string;

  const borderColor = useColorModeValue("gray.300", "gray.700");
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  const { data: org } = api.organizations.get.useQuery(slug, {
    enabled: !!slug,
  });

  const Icon = organizationIcon(org?.icon || 0);

  return (
    <WithFooter>
      <Container maxW="6xl" overflow="hidden">
        <Stack spacing="10">
          <HStack spacing="6">
            <Skeleton isLoaded={!!org} fitContent rounded="full">
              <Center w="16" h="16" rounded="full" bg="blue.400">
                <Icon size={32} color="white" />
              </Center>
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
              <Flex h="21px" alignItems="center">
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
              </Flex>
            </Stack>
          </HStack>
          <Tabs borderColor={borderColor} size="sm">
            <TabList gap="10">
              <SkeletonTab isLoaded={!!org}>Organization</SkeletonTab>
              <SkeletonTab isLoaded={!!org}>Members</SkeletonTab>
              <SkeletonTab isLoaded={!!org}>Settings</SkeletonTab>
              <SkeletonTab isLoaded={!!org}>Billing</SkeletonTab>
            </TabList>
            <TabPanels mt="10">
              <TabPanel p="0">
                <OrganizationTab />
              </TabPanel>
              <TabPanel p="0" />
              <TabPanel p="0">
                <SettingsTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Container>
    </WithFooter>
  );
}

interface SkeletonTabProps {
  isLoaded: boolean;
}

const SkeletonTab: React.FC<React.PropsWithChildren<SkeletonTabProps>> = ({
  isLoaded,
  children,
}) => {
  return (
    <Tab px="0" bg="none" fontWeight={600} pb="3">
      <Flex alignItems="center" h="21px">
        <SkeletonText isLoaded={isLoaded} noOfLines={1} skeletonHeight="4">
          <Text>{children}</Text>
        </SkeletonText>
      </Flex>
    </Tab>
  );
};
