import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  TabList,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  IconAlertCircleFilled,
  IconArrowRight,
  IconAt,
  IconCircleDot,
  IconDiscountCheck,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { AnimatedXCircle } from "../../components/animated-icons/x";
import { SkeletonTab } from "../../components/skeleton-tab";
import { WithFooter } from "../../components/with-footer";
import { useOrganization } from "../../hooks/use-organization";
import { useOrganizationMember } from "../../hooks/use-organization-member";
import { organizationIcon } from "../../utils/icons";
import { ConfettiLayer } from "./confetti-layer";
import { getBaseDomain } from "./utils/get-base-domain";
import { useOnboardingStep } from "./utils/use-onboarding-step";

export const OrganizationLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const toast = useToast();
  const id = router.query.id as string;
  const onboardingStep = useOnboardingStep();
  const isUpgraded = router.query.upgrade === "success";

  const { data: org, error } = useOrganization();
  const domain = getBaseDomain(org);
  const me = useOrganizationMember();

  const borderColor = useColorModeValue("gray.300", "gray.700");
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  React.useEffect(() => {
    if (!error) return;

    if (error.data?.httpStatus == 404) {
      void (async () => {
        await router.push("/orgs");
      })();

      toast({
        title: "That organization does not exist",
        status: "error",
        icon: <AnimatedXCircle />,
        containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const Icon = organizationIcon(org?.icon || 0);

  const getTabIndex = (route = router.pathname) => {
    switch (route) {
      case `/orgs/[id]`:
        return 0;
      case `/orgs/[id]/students`:
        return 1;
      case `/orgs/[id]/settings`:
        return 2;
      case `/orgs/[id]/billing`:
        return 3;
    }
  };

  const isLoaded = !!org;

  return (
    <WithFooter>
      <Container maxW="6xl" overflow="hidden">
        {isLoaded && isUpgraded && org.published && <ConfettiLayer />}
        <Stack spacing="10">
          <HStack spacing="6">
            <Skeleton isLoaded={isLoaded} fitContent rounded="full">
              <Center w="16" h="16" rounded="full" bg="blue.400">
                <Icon size={32} color="white" />
              </Center>
            </Skeleton>
            <Stack spacing={onboardingStep ? 2 : 0} flex="1" overflow="hidden">
              <Flex h="43.2px" alignItems="center" w="full">
                <SkeletonText
                  isLoaded={isLoaded}
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
                    {org?.published ? (
                      <Box color="blue.300">
                        <Tooltip label="Verified organization">
                          <IconDiscountCheck aria-label="Verified" />
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box color="gray.500">
                        <Tooltip label="Not published">
                          <IconCircleDot aria-label="Not published" />
                        </Tooltip>
                      </Box>
                    )}
                  </HStack>
                </SkeletonText>
              </Flex>
              {isLoaded && onboardingStep && (
                <Button
                  leftIcon={<IconArrowRight />}
                  w="max"
                  size="sm"
                  onClick={() => {
                    void router.push(`/orgs/${id}/${onboardingStep}`);
                  }}
                >
                  Continue setup
                </Button>
              )}
              {domain?.domain && (
                <Flex h="21px" alignItems="center">
                  <SkeletonText
                    noOfLines={1}
                    fitContent
                    w="max-content"
                    isLoaded={isLoaded}
                    skeletonHeight="10px"
                  >
                    <HStack spacing="1" color={mutedColor}>
                      <IconAt size="16" />
                      <Text fontSize="sm">{domain?.domain}</Text>
                    </HStack>
                  </SkeletonText>
                </Flex>
              )}
            </Stack>
          </HStack>
          <Tabs
            borderColor={borderColor}
            size="sm"
            index={getTabIndex()}
            isManual
          >
            <TabList gap="10">
              <SkeletonTab isLoaded={isLoaded} href={`/orgs/${id}`}>
                Members
              </SkeletonTab>
              <SkeletonTab isLoaded={isLoaded} href={`/orgs/${id}/students`}>
                Students
              </SkeletonTab>
              <SkeletonTab isLoaded={isLoaded} href={`/orgs/${id}/settings`}>
                <Box display="flex" gap="2" alignItems="center">
                  Settings
                  {domain?.conflicting && (
                    <Box display="inline-flex" color="orange.400" w="4" h="4">
                      <IconAlertCircleFilled size={16} />
                    </Box>
                  )}
                </Box>
              </SkeletonTab>
              {(getTabIndex() == 3 ||
                me?.role == "Admin" ||
                me?.role == "Owner") && (
                <SkeletonTab isLoaded={isLoaded} href={`/orgs/${id}/billing`}>
                  <Box display="flex" gap="2" alignItems="center">
                    Billing
                    {isLoaded && !org.published && (
                      <Box display="inline-flex" color="orange.400" w="4" h="4">
                        <IconAlertCircleFilled size={16} />
                      </Box>
                    )}
                  </Box>
                </SkeletonTab>
              )}
            </TabList>
            <TabPanels mt="10">{children}</TabPanels>
          </Tabs>
        </Stack>
      </Container>
    </WithFooter>
  );
};
