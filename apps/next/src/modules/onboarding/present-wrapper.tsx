import {
  Box,
  Center,
  Container,
  Fade,
  HStack,
  Heading,
  Tooltip,
  VStack,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Loading } from "../../components/loading";
import { SegmentedProgress } from "../../components/segmented-progress";
import { useLoading } from "../../hooks/use-loading";
import { useMe } from "../../hooks/use-me";
import { organizationIcon } from "../../utils/icons";

const computeMap = (
  invite = false,
  organizationBound = false,
  isMobile = false
) => {
  const base = ["", "/theme", "/username"];

  if (organizationBound) {
    if (!isMobile) base.push("/command-menu");
    base.push("/done");
    return base;
  }

  base.push("/account-type");
  if (!isMobile) base.push("/command-menu");
  if (invite) base.push("/invite");
  base.push("/subscribe", "/done");

  return base;
};

interface PresentWrapperContextProps {
  nextStep: () => void;
}

const PresentWrapperContext = React.createContext<PresentWrapperContextProps>({
  nextStep: () => undefined,
});

export const PresentWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const hasInvite = router.query.orgInvite === "true";
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const { data: me } = useMe();

  const isBound = !!me?.organization && !me.orgMembership;

  React.useEffect(() => {
    if (!me || hasInvite) return;
    if (!me.orgMembership || me.orgMembership.accepted) return;

    void router.replace({
      query: { orgInvite: true },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, hasInvite]);

  const muted = useColorModeValue("gray.500", "gray.500");

  const { loading } = useLoading();
  if (loading || !me) return <Loading fullHeight />;

  const map = computeMap(hasInvite, isBound, isMobile);

  const currentStep = router.pathname.replace("/onboarding", "");
  const query = hasInvite ? `?orgInvite=true` : "";

  const nextStep = () => {
    const next = map[map.indexOf(currentStep)! + 1];
    void router.push(next ? `/onboarding${next}${query}` : "/home");
  };

  const Icon = me.organization
    ? organizationIcon(me.organization.icon)
    : React.Fragment;

  return (
    <PresentWrapperContext.Provider value={{ nextStep }}>
      <Center minH="100vh" position="relative">
        {me.organization && (
          <VStack position="absolute" left="0" top="4" w="full">
            <Tooltip
              textAlign="center"
              py="2"
              label={`${
                me.email.split("@")[1]! || "example.com"
              } accounts are managed by your organization`}
            >
              <HStack>
                <Box color={muted}>
                  <Icon />
                </Box>
                <Heading size="sm">{me.organization.name}</Heading>
              </HStack>
            </Tooltip>
          </VStack>
        )}
        <Container maxW="3xl" py="20">
          <Fade
            in
            initial={{
              opacity: -1,
              translateY: -16,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: -1,
              translateY: -16,
              transition: {
                duration: 0.3,
                ease: "easeIn",
              },
            }}
          >
            {children}
          </Fade>
        </Container>
        <VStack position="absolute" left="0" bottom="4" w="full">
          <Box w="xs" px="4">
            <SegmentedProgress
              steps={map.length}
              currentStep={map.indexOf(currentStep)}
              clickable
              onClick={async (i) => {
                await router.push(`/onboarding${map[i]!}${query}`);
              }}
            />
          </Box>
        </VStack>
      </Center>
    </PresentWrapperContext.Provider>
  );
};

export const useNextStep = () =>
  React.useContext(PresentWrapperContext).nextStep;
