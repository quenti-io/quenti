import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Card,
  HStack,
  PinInput,
  PinInputField,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

import { PageWrapper } from "../../../common/page-wrapper";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import { Toast } from "../../../components/toast";
import { WizardLayout } from "../../../components/wizard-layout";
import { useOrganization } from "../../../hooks/use-organization";
import { getLayout } from "../../../layouts/main-layout";
import { OnboardingMetadata } from "../../../modules/organizations/onboarding-metadata";

export default function OrgVerifyEmail() {
  const router = useRouter();

  const [code, setCode] = React.useState("");
  const toast = useToast();
  const lastInputRef = React.useRef<HTMLInputElement>(null);

  const { data: org } = useOrganization();
  const studentDomain = org?.domains.find((d) => d.type == "Student");

  const verifyStudentDomain = api.organizations.verifyStudentDomain.useMutation(
    {
      onSuccess: () => {
        setTimeout(() => {
          void (async () => {
            await router.push(`/orgs/${org!.id}/publish`);
          })();
        }, 1000);
      },
      onError: (e) => {
        requestAnimationFrame(() => {
          lastInputRef.current?.focus();
        });

        if (e.message == "code_expired" || e.message == "too_many_requests")
          toast({
            title:
              e.message == "code_expired"
                ? "That code has expired, please resend a confirmation email"
                : "Too many requests, please try again later",
            status: "error",
            colorScheme: "red",
            icon: <AnimatedXCircle />,
            render: Toast,
          });
      },
    },
  );

  const resendCode = api.organizations.resendCode.useMutation({
    onSuccess: () => {
      toast({
        title: "Sent a new confirmation email",
        status: "success",
        colorScheme: "green",
        icon: <AnimatedCheckCircle />,
        render: Toast,
      });
    },
    onError: (e) => {
      if (e.message == "too_many_requests") {
        toast({
          title: "Too many requests, please try again later",
          status: "error",
          colorScheme: "red",
          icon: <AnimatedXCircle />,
          render: Toast,
        });
      }
    },
  });

  const loading = (
    <Box
      w="6"
      h="6"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="blue.300"
    >
      <Spinner w="20px" h="20px" />
    </Box>
  );

  const success = (
    <Box color="green.300">
      <AnimatedCheckCircle />
    </Box>
  );

  const error = (
    <Box color="red.300">
      <AnimatedXCircle />
    </Box>
  );

  return (
    <OnboardingMetadata step="verify-domain">
      <WizardLayout
        title="Verify your domain"
        seoTitle="Verify Domain"
        description={`Enter the code we sent to ${
          studentDomain?.verifiedEmail || "example@example.com"
        }.`}
        steps={5}
        currentStep={3}
        enableSkeleton
        isLoaded={!!studentDomain}
        cardIn={!!studentDomain}
      >
        <Stack spacing="5">
          <Box px="8">
            <Text fontSize="sm">
              Not seeing your email?{" "}
              <Button
                variant="link"
                fontSize="sm"
                isLoading={resendCode.isLoading}
                onClick={() => {
                  resendCode.mutate({ orgId: org!.id });
                }}
              >
                Resend
              </Button>
            </Text>
          </Box>
          <Card p="8" variant="outline" shadow="lg" rounded="lg">
            <Stack spacing="10">
              <VStack spacing="6">
                <Stack spacing="3">
                  <HStack spacing="4">
                    <Box w="6" />
                    <HStack>
                      <PinInput
                        type="number"
                        size="lg"
                        value={code}
                        onChange={(e) => {
                          setCode(e);
                          if (e.length == 6)
                            verifyStudentDomain.mutate({
                              orgId: org!.id,
                              code: e,
                            });
                        }}
                        isDisabled={
                          verifyStudentDomain.isLoading ||
                          verifyStudentDomain.isSuccess
                        }
                      >
                        <PinInputField autoFocus />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField ref={lastInputRef} />
                      </PinInput>
                    </HStack>
                    <Box w="6" h="6">
                      {verifyStudentDomain.isLoading
                        ? loading
                        : verifyStudentDomain.isSuccess
                          ? success
                          : verifyStudentDomain.isError
                            ? error
                            : null}
                    </Box>
                  </HStack>
                </Stack>
              </VStack>
            </Stack>
          </Card>
        </Stack>
      </WizardLayout>
    </OnboardingMetadata>
  );
}

OrgVerifyEmail.PageWrapper = PageWrapper;
OrgVerifyEmail.getLayout = getLayout;
