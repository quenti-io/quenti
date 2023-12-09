import React from "react";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  PinInput,
  PinInputField,
  Spinner,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { AnimatedXCircle } from "../../components/animated-icons/x";
import { SegmentedProgress } from "../../components/segmented-progress";
import { Toast } from "../../components/toast";
import { useOrganization } from "../../hooks/use-organization";
import { DomainForm } from "./domain-form";

export interface UpdateDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  verify: boolean;
  onUpdate: () => void;
}

export const UpdateDomainModal: React.FC<UpdateDomainModalProps> = ({
  isOpen,
  onClose,
  verify,
  onUpdate,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      {verify ? (
        <VerifyEmailContainer onClose={onClose} />
      ) : (
        <UpdateDomainContainer onClose={onClose} onSuccess={onUpdate} />
      )}
    </Modal>
  );
};

interface UpdateDomainContainerProps {
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateDomainContainer: React.FC<UpdateDomainContainerProps> = ({
  onClose,
  onSuccess,
}) => {
  const utils = api.useUtils();
  const formRef = React.useRef<HTMLFormElement>(null);
  const { data: org } = useOrganization();
  const studentDomain = org?.domains.find((d) => d.type == "Student");
  const [loading, setLoading] = React.useState(false);

  return (
    <Modal.Content>
      <Modal.Body>
        <SegmentedProgress steps={2} currentStep={0} />
        <Modal.Heading>
          {studentDomain ? "Update your domain" : "Add a student domain"}
        </Modal.Heading>
        <DomainForm
          formRef={formRef}
          onSuccess={async () => {
            await utils.organizations.get.invalidate();
            onSuccess();
          }}
          onChangeLoading={setLoading}
        />
      </Modal.Body>
      <Modal.Divider />
      <Modal.Footer>
        <ButtonGroup>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              formRef.current?.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true }),
              );
            }}
            isLoading={loading}
          >
            {`${studentDomain ? "Update" : "Add"} domain`}
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal.Content>
  );
};

interface VerifyEmailContainerProps {
  onClose: () => void;
}

const VerifyEmailContainer: React.FC<VerifyEmailContainerProps> = ({
  onClose,
}) => {
  const utils = api.useUtils();
  const { data: org } = useOrganization();
  const studentDomain = org?.domains.find((d) => d.type == "Student");
  const muted = useColorModeValue("gray.700", "gray.300");
  const toast = useToast();

  const [code, setCode] = React.useState("");
  const lastInputRef = React.useRef<HTMLInputElement>(null);

  const verifyStudentDomain = api.organizations.verifyStudentDomain.useMutation(
    {
      onSuccess: async ({ domain }) => {
        await utils.organizations.get.invalidate();

        setTimeout(() => {
          onClose();

          toast({
            title: `Added ${domain}`,
            status: "success",
            colorScheme: "green",
            icon: <AnimatedCheckCircle />,
            render: Toast,
          });
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
    <Modal.Content>
      <Modal.Body>
        <SegmentedProgress steps={2} currentStep={1} />
        <Modal.Heading>Verify your domain</Modal.Heading>
        <Stack spacing="8">
          <Stack>
            <Text>
              Enter the code we sent to {studentDomain?.verifiedEmail}
            </Text>
            <Text fontSize="sm" color={muted}>
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
          </Stack>
          <VStack>
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
          </VStack>
        </Stack>
      </Modal.Body>
    </Modal.Content>
  );
};
