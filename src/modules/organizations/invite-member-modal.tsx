import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { IconLink } from "@tabler/icons-react";
import { api } from "../../utils/api";
import { env } from "../../env/client.mjs";
import { AnimatedCheckCircle } from "../../components/animated-icons/check";

export interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  token?: string;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  orgId,
  token,
}) => {
  const utils = api.useContext();
  const toast = useToast();

  const modalBg = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  const createInvite = api.organizations.createInvite.useMutation({
    onSuccess: async (token) => {
      await copyInviteLink(token);
      await utils.organizations.get.invalidate();
    },
  });

  const copyInviteLink = async (providedToken?: string) => {
    await navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_BASE_URL}/orgs?token=${providedToken || token || ""}`
    );
    toast({
      title: "Invite link copied to clipboard",
      status: "success",
      icon: <AnimatedCheckCircle />,
      containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" background="blackAlpha.400" />
      <ModalContent rounded="lg" bg={modalBg} shadow="xl">
        <ModalBody py="8" px="10">
          <Stack spacing="6">
            <Heading size="lg">Invite organization member</Heading>
            <Stack spacing="6">
              <FormControl>
                <FormLabel>Email or username</FormLabel>
                <Input placeholder="email@example.com" />
              </FormControl>
              <FormControl>
                <Checkbox defaultChecked>Send an invite email</Checkbox>
              </FormControl>
            </Stack>
          </Stack>
        </ModalBody>
        <Divider borderColor={dividerColor} borderBottomWidth="2px" />
        <ModalFooter px="10" py="6">
          <Flex justifyContent="space-between" w="full">
            <Button
              variant="link"
              leftIcon={<IconLink size={18} />}
              onClick={async () => {
                if (token) {
                  await copyInviteLink();
                } else {
                  await createInvite.mutateAsync(orgId);
                }
              }}
              isLoading={createInvite.isLoading}
            >
              Copy invite link
            </Button>
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">Invite</Button>
            </ButtonGroup>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
