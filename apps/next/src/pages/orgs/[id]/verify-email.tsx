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
import React from "react";
import { AnimatedCheckCircle } from "../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../components/animated-icons/x";
import { WizardLayout } from "../../../components/wizard-layout";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";

export default function OrgVerifyEmail() {
  const router = useRouter();
  const id = router.query.id as string;

  const [code, setCode] = React.useState("");
  const toast = useToast();
  const lastInputRef = React.useRef<HTMLInputElement>(null);

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id,
      retry: false,
    }
  );

  const confirmCode = api.organizations.confirmCode.useMutation({
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
          icon: <AnimatedXCircle />,
          containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
        });
    },
  });

  const resendCode = api.organizations.resendCode.useMutation({
    onSuccess: () => {
      toast({
        title: "Sent a new confirmation email",
        status: "success",
        icon: <AnimatedCheckCircle />,
        containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
      });
    },
    onError: (e) => {
      if (e.message == "too_many_requests") {
        toast({
          title: "Too many requests, please try again later",
          status: "error",
          icon: <AnimatedXCircle />,
          containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
        });
      }
    },
  });

  React.useEffect(() => {
    if (org?.domain?.verifiedAt) {
      void (async () => {
        await router.push(`/orgs/${org.id}/publish`);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);

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
    <WizardLayout
      title="Verify your domain"
      description={`Enter the code we sent to ${
        org?.domain?.verifiedEmail || "example@example.com"
      }.`}
      steps={5}
      currentStep={3}
      enableSkeleton
      isLoaded={!!org?.domain}
      cardIn={!!org?.domain}
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
                          confirmCode.mutate({
                            orgId: org!.id,
                            code: e,
                          });
                      }}
                      isDisabled={
                        confirmCode.isLoading || confirmCode.isSuccess
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
                    {confirmCode.isLoading
                      ? loading
                      : confirmCode.isSuccess
                      ? success
                      : confirmCode.isError
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
  );
}
