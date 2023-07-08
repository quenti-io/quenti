import {
  Avatar,
  Box,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
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
import {
  IconBuilding,
  IconBuildingArch,
  IconBuildingBank,
  IconBuildingCastle,
  IconBuildingEstate,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconDiscountCheck,
  IconTower,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { WithFooter } from "../../../components/with-footer";
import { getBaseDomain } from "../../../lib/urls";
import { SettingsWrapper } from "../../../modules/organizations/settings-wrapper";
import { api } from "../../../utils/api";

export default function OrganizationsPage() {
  const router = useRouter();
  const slug = router.query.slug as string;

  const borderColor = useColorModeValue("gray.300", "gray.700");
  const inputBorder = useColorModeValue("gray.400", "gray.600");
  const mutedColor = useColorModeValue("gray.700", "gray.300");
  const addonBg = useColorModeValue("gray.100", "gray.750");
  const iconColor = useColorModeValue("#171923", "white");

  const [orgName, setOrgName] = React.useState("");
  const [orgSlug, setOrgSlug] = React.useState("");
  const [icon, setIcon] = React.useState(0);

  const { data: org } = api.organizations.get.useQuery(slug, {
    enabled: !!slug,
  });

  React.useEffect(() => {
    if (org) {
      setOrgName(org.name);
      setOrgSlug(org.slug);
    }
  }, [org]);

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
              <Tab px="0" bg="none" fontWeight={600} pb="3">
                Organization
              </Tab>
              <Tab px="0" bg="none" fontWeight={600} pb="3">
                Members
              </Tab>
              <Tab px="0" bg="none" fontWeight={600} pb="3">
                Settings
              </Tab>
              <Tab px="0" bg="none" fontWeight={600} pb="3">
                Billing
              </Tab>
            </TabList>
            <TabPanels mt="10">
              <TabPanel p="0">
                <Stack spacing="5">
                  <SettingsWrapper
                    heading="General"
                    description="Global organization settings"
                    isLoaded={!!org}
                  >
                    <Stack spacing="3" pb="2px">
                      <Skeleton rounded="md" w="full" isLoaded={!!org}>
                        <Input
                          borderColor={inputBorder}
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                        />
                      </Skeleton>
                      <Skeleton rounded="md" w="full" isLoaded={!!org}>
                        <InputGroup borderColor={inputBorder}>
                          <InputLeftAddon bg={addonBg} color="gray.500">
                            {getBaseDomain()}/orgs/
                          </InputLeftAddon>
                          <Input
                            value={orgSlug}
                            onChange={(e) => setOrgSlug(e.target.value)}
                          />
                        </InputGroup>
                      </Skeleton>
                    </Stack>
                  </SettingsWrapper>
                  <Divider />
                  <SettingsWrapper
                    heading="Organization Icon"
                    description="Choose an icon for your organization"
                    isLoaded={!!org}
                  >
                    <Box ml="-4px" mt="-4px">
                      {[
                        IconBuilding,
                        IconBuildingArch,
                        IconBuildingBank,
                        IconBuildingCastle,
                        IconBuildingEstate,
                        IconBuildingSkyscraper,
                        IconBuildingStore,
                        IconTower,
                      ].map((Icon, i) => (
                        <Box display="inline-block" p="1" key={i}>
                          <Skeleton rounded="md" isLoaded={!!org}>
                            <IconButton
                              w="max"
                              variant={icon == i ? "solid" : "ghost"}
                              aria-label="Icon"
                              onClick={() => setIcon(i)}
                              icon={
                                <Icon
                                  size={18}
                                  style={{ transition: "all 300ms" }}
                                  color={icon == i ? "white" : iconColor}
                                />
                              }
                            />
                          </Skeleton>
                        </Box>
                      ))}
                    </Box>
                  </SettingsWrapper>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Container>
    </WithFooter>
  );
}
