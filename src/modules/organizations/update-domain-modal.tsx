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
import React from "react";
import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { AnimatedXCircle } from "../../components/animated-icons/x";
import { Modal } from "../../components/modal";
import { SegmentedProgress } from "../../components/segmented-progress";
import { useOrganization } from "../../hooks/use-organization";
import { api } from "../../utils/api";
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
  const utils = api.useContext();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <Modal.Content>
      <Modal.Body>
        <SegmentedProgress steps={2} currentStep={0} />
        <Modal.Heading>Update your domain</Modal.Heading>
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
                new Event("submit", { cancelable: true, bubbles: true })
              );
            }}
            isLoading={loading}
          >
            Update domain
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
  const utils = api.useContext();
  const org = useOrganization()!;
  const muted = useColorModeValue("gray.700", "gray.300");
  const toast = useToast();

  const [code, setCode] = React.useState("");
  const lastInputRef = React.useRef<HTMLInputElement>(null);

  const confirmCode = api.organizations.confirmCode.useMutation({
    onSuccess: async () => {
      await utils.organizations.get.invalidate();

      setTimeout(() => {
        onClose();

        toast({
          title: `Added ${org.domain!.requestedDomain}`,
          status: "success",
          icon: <AnimatedCheckCircle />,
          containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
        });
      }, 1000);
    },
    onError: (e) => {
      requestAnimationFrame(() => {
        lastInputRef.current?.focus();
      });

      if (e.message == "too_many_requests")
        toast({
          title: "Too many requests, please try again later",
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
            <Text>Enter the code we sent to {org.domain!.verifiedEmail}</Text>
            <Text fontSize="sm" color={muted}>
              Not seeing your email?{" "}
              <Button
                variant="link"
                fontSize="sm"
                isLoading={resendCode.isLoading}
                onClick={() => {
                  resendCode.mutate({ orgId: org.id });
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
                      confirmCode.mutate({
                        orgId: org.id,
                        code: e,
                      });
                  }}
                  isDisabled={confirmCode.isLoading || confirmCode.isSuccess}
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
          </VStack>
        </Stack>
      </Modal.Body>
    </Modal.Content>
  );
};
