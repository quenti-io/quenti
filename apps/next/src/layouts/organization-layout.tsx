import { useRouter } from "next/router";
import React from "react";

import { HeadSeo, Link } from "@quenti/components";

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
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  forwardRef,
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

import { AnimatedXCircle } from "../components/animated-icons/x";
import { AuthedPage } from "../components/authed-page";
import { ConfettiLayer } from "../components/confetti-layer";
import { Footer } from "../components/footer";
import { Toast } from "../components/toast";
import { useOrganization } from "../hooks/use-organization";
import { useOrganizationMember } from "../hooks/use-organization-member";
import { getBaseDomain } from "../modules/organizations/utils/get-base-domain";
import { useOnboardingStep } from "../modules/organizations/utils/use-onboarding-step";
import { organizationIcon } from "../utils/icons";
import { MainLayout } from "./main-layout";

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

  const borderColor = useColorModeValue("gray.200", "gray.750");
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
        colorScheme: "red",
        render: Toast,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const Icon = organizationIcon(org?.icon || 0);
  const { index, name: tabName } = useCurrentTab();
  const isLoaded = !!org;

  return (
    <AuthedPage>
      <MainLayout>
        <HeadSeo
          title={`${tabName}${org ? ` - ${org.name}` : ""}`}
          nextSeoProps={{
            noindex: true,
            nofollow: true,
          }}
        />
        <Box mt="2" pb="30" style={{ minHeight: "calc(100vh - 112px)" }}>
          <Tabs borderColor={borderColor} size="sm" index={index} isManual>
            <OrganizationTabList />
            <Container maxW="6xl" overflow="hidden">
              <TabPanels mt="10">{children}</TabPanels>
            </Container>
          </Tabs>
          <Container maxW="6xl" overflow="hidden">
            {isLoaded && isUpgraded && org.published && <ConfettiLayer />}
            <Stack spacing="10">
              <HStack spacing="6">
                <Skeleton isLoaded={isLoaded} fitContent rounded="full">
                  <Center w="16" h="16" rounded="full" bg="blue.400">
                    <Icon size={32} color="white" />
                  </Center>
                </Skeleton>
                <Stack
                  spacing={onboardingStep ? 2 : 0}
                  flex="1"
                  overflow="hidden"
                >
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
            </Stack>
          </Container>
        </Box>
        <Footer />
      </MainLayout>
    </AuthedPage>
  );
};

const OrganizationTabList = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: org } = useOrganization();
  const domain = getBaseDomain(org);

  const me = useOrganizationMember();
  const { index } = useCurrentTab();

  const [hasHover, setHasHover] = React.useState(false);
  const [hover, setHover] = React.useState<number | null>(null);
  const navRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const isLoaded = !!org;

  const getTransformProperties = (index: number) => {
    const nav = navRef.current[index];
    const transform = nav
      ? `translateX(${nav.offsetLeft - 12}px)`
      : "translateX(0)";
    const width = nav ? nav.getBoundingClientRect().width + 24 : 0;
    const height = nav ? nav.offsetHeight - 6 : 0;

    return { transform, width, height };
  };

  const { transform, width, height } = getTransformProperties(hover || 0);

  return (
    <Box
      w="full"
      borderBottomWidth="2px"
      px="10"
      borderColor="gray.200"
      _dark={{
        borderColor: "gray.750",
      }}
    >
      <TabList
        gap="6"
        borderBottom="none"
        position="relative"
        w="max"
        onPointerEnter={() => setHasHover(true)}
        onPointerLeave={() => setHasHover(false)}
      >
        <Box
          position="absolute"
          bg="gray.200"
          _dark={{
            bg: "gray.700",
          }}
          width={width}
          height={height}
          rounded="md"
          transform={transform}
          transition="all 0.15s ease-in-out"
          opacity={hasHover ? 1 : 0}
        />
        <SkeletonTab
          isLoaded={isLoaded}
          href={`/orgs/${id}`}
          ref={(e: HTMLDivElement) => (navRef.current[0] = e)}
          onPointerEnter={() => setHover(0)}
          hover={hasHover && hover === 0}
        >
          Dashboard
        </SkeletonTab>
        <SkeletonTab
          isLoaded={isLoaded}
          href={`/orgs/${id}/students`}
          ref={(e: HTMLDivElement) => (navRef.current[1] = e)}
          onPointerEnter={() => setHover(1)}
          hover={hasHover && hover == 1}
        >
          Students
        </SkeletonTab>
        <SkeletonTab
          isLoaded={isLoaded}
          href={`/orgs/${id}/settings`}
          ref={(e: HTMLDivElement) => (navRef.current[2] = e)}
          onPointerEnter={() => setHover(2)}
          hover={hasHover && hover == 2}
        >
          <Box display="flex" gap="2" alignItems="center">
            Settings
            {domain?.conflicting && (
              <Box display="inline-flex" color="orange.400" w="4" h="4">
                <IconAlertCircleFilled size={16} />
              </Box>
            )}
          </Box>
        </SkeletonTab>
        {(index == 3 || me?.role == "Admin" || me?.role == "Owner") && (
          <SkeletonTab
            isLoaded={isLoaded}
            href={`/orgs/${id}/billing`}
            ref={(e: HTMLDivElement) => (navRef.current[3] = e)}
            onPointerEnter={() => setHover(3)}
            hover={hasHover && hover == 3}
          >
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
    </Box>
  );
};

const useCurrentTab = (route?: string): { index: number; name: string } => {
  const router = useRouter();

  const getCurrentTab = (route = router.pathname) => {
    switch (route) {
      case `/orgs/[id]`:
        return [0, "Dashboard"];
      case `/orgs/[id]/students`:
        return [1, "Students"];
      case `/orgs/[id]/settings`:
        return [2, "Settings"];
      case `/orgs/[id]/billing`:
        return [3, "Billing"];
      default:
        return [0, "Undefined"];
    }
  };

  const [index, name] = getCurrentTab(route);
  return { index: index as number, name: name as string };
};

interface SkeletonTabProps {
  isLoaded: boolean;
  href: string;
  onPointerEnter?: () => void;
  hover?: boolean;
}
export const SkeletonTab = forwardRef(function SkeletonTab(
  {
    isLoaded,
    children,
    href,
    onPointerEnter,
    hover,
  }: React.PropsWithChildren<SkeletonTabProps>,
  ref,
) {
  return (
    <Link href={href} ref={ref}>
      <Tab
        onPointerEnter={onPointerEnter}
        px="2px"
        bg="none"
        fontWeight={600}
        pb="4"
        pt="6px"
        transition="all 0.15s ease-in-out"
        color={hover ? "gray.900" : "gray.500"}
        borderBottomWidth={0}
        position="relative"
        _selected={{
          color: "gray.900",
          _after: {
            bg: "blue.300",
          },
        }}
        _dark={{
          color: hover ? "gray.50" : "gray.500",
          _selected: {
            color: "gray.50",
          },
        }}
        _after={{
          transition: "all 0.15s ease-in-out",
          bottom: 0,
          left: "-5px",
          content: '""',
          position: "absolute",
          width: "calc(100% + 10px)",
          height: "2.5px",
          rounded: "full",
        }}
      >
        <Flex alignItems="center" h="21px">
          <SkeletonText isLoaded={isLoaded} noOfLines={1} skeletonHeight="4">
            {children}
          </SkeletonText>
        </Flex>
      </Tab>
    </Link>
  );
});

export const getLayout = (page: React.ReactElement) => (
  <OrganizationLayout>{page}</OrganizationLayout>
);
