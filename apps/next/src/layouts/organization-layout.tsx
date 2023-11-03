import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { HeadSeo } from "@quenti/components/head-seo";

import {
  Box,
  Container,
  Flex,
  SkeletonText,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  forwardRef,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { IconAlertCircleFilled } from "@tabler/icons-react";

import { LazyWrapper } from "../common/lazy-wrapper";
import { ToastWrapper } from "../common/toast-wrapper";
import { AnimatedXCircle } from "../components/animated-icons/x";
import { AuthedPage } from "../components/authed-page";
import { ConfettiPlayer } from "../components/confetti-layer";
import { Footer } from "../components/footer";
import { Toast } from "../components/toast";
import { useOrganization } from "../hooks/use-organization";
import { useOrganizationMember } from "../hooks/use-organization-member";
import { useStudentRedirect } from "../hooks/use-student-redirect";
import { getBaseDomain } from "../modules/organizations/utils/get-base-domain";
import { MainLayout } from "./main-layout";

export const OrganizationLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const toast = useToast();
  const isUpgraded = router.query.upgrade === "success";

  useStudentRedirect("/home");

  const { data: org, error } = useOrganization();

  const borderColor = useColorModeValue("gray.200", "gray.750");

  React.useEffect(() => {
    if (!error) return;

    if (error.data?.httpStatus == 404) {
      void (async () => {
        await router.push("/home");
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
        <LazyWrapper>
          <ToastWrapper>
            <Box pb="30" style={{ minHeight: "calc(100vh - 80px)" }}>
              <Tabs
                borderColor={borderColor}
                size="sm"
                index={index}
                isManual
                overflow="hidden"
              >
                <Box pb="2" overflowX="auto">
                  <OrganizationTabList />
                </Box>
                <Container maxW="6xl" overflow="hidden">
                  <TabPanels mt="10">{children}</TabPanels>
                </Container>
              </Tabs>
              <Container maxW="6xl" overflow="hidden">
                {isLoaded && isUpgraded && org.published && <ConfettiPlayer />}
              </Container>
            </Box>
          </ToastWrapper>
          <Footer />
        </LazyWrapper>
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

  const tabContent = [
    { content: "Dashboard", slug: "" },
    { content: "Classes", slug: "/classes" },
    { content: "Teachers", slug: "/teachers" },
    { content: "Students", slug: "/students" },
    {
      content: (
        <Box display="flex" gap="2" alignItems="center" key="Settings">
          Settings
          {domain?.conflicting && (
            <Box display="inline-flex" color="orange.400" w="4" h="4">
              <IconAlertCircleFilled size={16} />
            </Box>
          )}
        </Box>
      ),
      slug: "/settings",
    },
    {
      content: (
        <Box display="flex" gap="2" alignItems="center" key="Billing">
          Billing
          {isLoaded && !org.published && (
            <Box display="inline-flex" color="orange.400" w="4" h="4">
              <IconAlertCircleFilled size={16} />
            </Box>
          )}
        </Box>
      ),
      slug: "/billing",
      admin: true,
    },
  ];

  return (
    <Box
      w="fit-content"
      minW="100%"
      borderBottomWidth="2px"
      px={{ base: 8, md: "10" }}
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
        {tabContent.map(
          ({ content, slug, admin }, i) =>
            (!admin ||
              index == i ||
              me?.role == "Admin" ||
              me?.role == "Owner") && (
              <SkeletonTab
                key={i}
                isLoaded={isLoaded}
                href={`/orgs/${id}${slug}`}
                ref={(e: HTMLDivElement) => (navRef.current[i] = e)}
                onPointerEnter={() => setHover(i)}
                hover={hasHover && hover === i}
              >
                {content}
              </SkeletonTab>
            ),
        )}
      </TabList>
    </Box>
  );
};

const useCurrentTab = (route?: string): { index: number; name: string } => {
  const router = useRouter();

  const ROUTES = [
    { path: `/orgs/[id]`, name: "Dashboard" },
    { path: `/orgs/[id]/classes`, name: "Classes" },
    { path: `/orgs/[id]/teachers`, name: "Teachers" },
    { path: `/orgs/[id]/students`, name: "Students" },
    { path: `/orgs/[id]/settings`, name: "Settings" },
    { path: `/orgs/[id]/billing`, name: "Billing" },
  ];

  const getCurrentTab = (route = router.pathname) => {
    const index = ROUTES.findIndex((r) => r.path === route);
    const name = ROUTES[index]?.name;
    return { index: Math.max(index, 0), name: name || "Undefined" };
  };

  return getCurrentTab(route);
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
