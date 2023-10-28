import { useRouter } from "next/router";
import React from "react";

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

import { IconBuildingSkyscraper } from "@tabler/icons-react";

import { Loading } from "../../components/loading";
import { SegmentedProgress } from "../../components/segmented-progress";
import { useLoading } from "../../hooks/use-loading";
import { useMe } from "../../hooks/use-me";
import { useUnauthedRedirect } from "../../hooks/use-unauthed-redirect";
import { getSafeRedirectUrl } from "../../lib/urls";

const computeMap = (
  invite = false,
  orgMembership = false,
  organizationBound = false,
  isMobile = false,
) => {
  const base = [
    "",
    "/theme",
    "/username",
    "/account-type",
    "/command-menu",
    "/invite",
    "/subscribe",
    "/done",
  ];
  const remove = (index: string) => base.splice(base.indexOf(index), 1);

  if (isMobile) remove("/command-menu");
  if (!invite) remove("/invite");
  if (organizationBound) {
    if (!orgMembership) remove("/subscribe");
    remove("/account-type");
  }

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
  const callbackUrl = router.query.callbackUrl as string;
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  useUnauthedRedirect();
  const { data: me } = useMe();

  const isBound = !!me?.organization;
  const hasMembership = !!me?.orgMembership;

  const hasInvite = !!me?.orgInvites.length;
  const map = computeMap(hasInvite, hasMembership, isBound, isMobile);

  const currentStep = router.pathname.replace("/onboarding", "");

  const getFinalizedCallbackUrl = () => {
    if (!callbackUrl) return "/home";
    return getSafeRedirectUrl(callbackUrl);
  };

  const nextStep = () => {
    const next = map[map.indexOf(currentStep)! + 1];
    if (next) {
      void router.replace({
        pathname: `/onboarding${next}`,
        query: {
          callbackUrl,
        },
      });
    } else void router.push(getFinalizedCallbackUrl());
  };

  const muted = useColorModeValue("gray.500", "gray.500");

  const { loading } = useLoading();
  if (loading || !me) return <Loading fullHeight />;

  return (
    <PresentWrapperContext.Provider value={{ nextStep }}>
      <Center minH="100vh" position="relative">
        {me.organization && (
          <VStack position="absolute" left="0" top="6" w="full">
            <Tooltip
              textAlign="center"
              py="2"
              label={`${
                me.email.split("@")[1]! || "example.com"
              } accounts are managed by your organization`}
            >
              <HStack>
                <Box color={muted}>
                  <IconBuildingSkyscraper />
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
              disableFrom={!me.username ? 3 : undefined}
              onClick={async (i) => {
                await router.replace({
                  pathname: `/onboarding${map[i]!}`,
                  query: {
                    callbackUrl,
                  },
                });
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
