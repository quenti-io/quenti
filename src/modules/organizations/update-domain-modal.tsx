import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
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
  const org = useOrganization();
  const utils = api.useContext();
  const [domain, setDomain] = React.useState("");
  const [email, setEmail] = React.useState("");

  const muted = useColorModeValue("gray.700", "gray.300");

  const verifyDomain = api.organizations.verifyDomain.useMutation({
    onSuccess: async () => {
      await utils.organizations.get.invalidate();
      onSuccess();
    },
  });

  return (
    <Modal.Content>
      <Modal.Body>
        <SegmentedProgress steps={2} currentStep={0} />
        <Modal.Heading>Update domain</Modal.Heading>
        <Stack spacing="6">
          <Text color={muted}>
            Once updated, students enrolled with the previous domain will no
            longer be connected to this organization.
          </Text>
          <FormControl>
            <FormLabel>Domain</FormLabel>
            <Input
              placeholder="example.edu"
              autoFocus
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email for verification</FormLabel>
            <Input
              placeholder={
                !domain.trim().length
                  ? `Email address for that domain`
                  : `Email address ending in @${domain.trim()}`
              }
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>
        </Stack>
      </Modal.Body>
      <Modal.Divider />
      <Modal.Footer>
        <ButtonGroup>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            isDisabled={!domain.trim().length || !email.trim().length}
            isLoading={verifyDomain.isLoading}
            onClick={() => {
              verifyDomain.mutate({
                orgId: org!.id,
                domain: domain.trim(),
                email: email.trim(),
              });
            }}
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
    onError: () => {
      requestAnimationFrame(() => {
        lastInputRef.current?.focus();
      });
    },
  });

  const resendCode = api.organizations.resendCode.useMutation();

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
