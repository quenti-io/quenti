import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Box,
  Fade,
  Heading,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { IconAirBalloon } from "@tabler/icons-react";

import { PageWrapper } from "../../../common/page-wrapper";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import { Toast } from "../../../components/toast";
import { WizardLayout } from "../../../components/wizard-layout";
import { getLayout } from "../../../layouts/main-layout";
import { GlowingButton } from "../../../modules/organizations/glowing-button";
import { OnboardingMetadata } from "../../../modules/organizations/onboarding-metadata";

export default function OrgPublish() {
  const router = useRouter();
  const id = router.query.id as string;

  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  const publish = api.organizations.publish.useMutation({
    onSuccess: async ({ callback }) => {
      await router.push(callback);
    },
    onError: async (error) => {
      await router.push(`/orgs/${id}/billing`);
      toast({
        title: error.message,
        status: "error",
        colorScheme: "red",
        icon: <AnimatedXCircle />,
        render: Toast,
      });
    },
  });

  React.useEffect(() => {
    if (publish.isLoading) setIsLoading(true);
  }, [publish.isLoading]);

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id,
    },
  );

  const gradient = useColorModeValue(
    "linear(to-t, gray.50, transparent)",
    "linear(to-t, gray.800, transparent)",
  );
  const balloon = useColorModeValue("gray.200", "gray.700");
  const balloonFill = useColorModeValue("#E2E8F0", "#2D3748");

  return (
    <OnboardingMetadata step="publish">
      <WizardLayout
        title="Publish"
        seoTitle="Publish Organization"
        description={"That's it! Your organization is ready to be published."}
        steps={5}
        currentStep={4}
      >
        <VStack px="8" mt="12">
          <Box maxW="sm" w="full">
            <Box role="group">
              <GlowingButton
                isLoading={isLoading}
                onClick={() =>
                  publish.mutate({
                    orgId: router.query.id as string,
                  })
                }
              >
                <Box
                  position="absolute"
                  color={balloon}
                  transition="all 0.75s ease-in-out"
                  transform="translateY(10px)"
                  opacity="0.9"
                  _groupHover={{
                    transform: "translateY(-68px)",
                    color: "blue.300",
                  }}
                >
                  <Fade in={!!org}>
                    <IconAirBalloon
                      size={120}
                      style={{
                        strokeWidth: 1,
                        fill: balloonFill,
                      }}
                    />
                  </Fade>
                </Box>
                <Box
                  position="absolute"
                  color={balloon}
                  transition="all 0.75s ease-in-out"
                  left="calc(50% - 60px)"
                  transform="translateY(20px)"
                  opacity="0"
                  _groupHover={{
                    transform:
                      "translateY(-58px) translateX(-24px) rotate(-10deg)",
                    color: "blue.300",
                    opacity: "0.7",
                  }}
                >
                  <IconAirBalloon
                    size={48}
                    style={{
                      strokeWidth: 2,
                      fill: balloonFill,
                    }}
                  />
                </Box>
                <Box
                  position="absolute"
                  color={balloon}
                  transition="all 0.75s ease-in-out"
                  left="calc(50%)"
                  transform="translateY(20px)"
                  opacity="0"
                  _groupHover={{
                    transform:
                      "translateY(-80px) translateX(32px) rotate(5deg)",
                    color: "blue.300",
                    opacity: "0.5",
                  }}
                  fill={balloon}
                >
                  <IconAirBalloon
                    size={52}
                    style={{
                      strokeWidth: 2,
                      fill: balloonFill,
                    }}
                  />
                </Box>
                <Box
                  position="absolute"
                  w="100%"
                  h="100%"
                  top="0"
                  rounded="xl"
                  bgGradient={gradient}
                />
                <Box zIndex={20} px="6">
                  <Fade in={!!org}>
                    <Heading size="md">
                      Publish {org?.name || "Placeholder"}
                    </Heading>
                  </Fade>
                </Box>
              </GlowingButton>
            </Box>
          </Box>
        </VStack>
      </WizardLayout>
    </OnboardingMetadata>
  );
}

OrgPublish.PageWrapper = PageWrapper;
OrgPublish.getLayout = getLayout;
