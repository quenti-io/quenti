import {
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { IconLink } from "@tabler/icons-react";
import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { Modal } from "../../components/modal";
import { env } from "../../env/client.mjs";
import { api } from "../../utils/api";

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Invite organization member</Modal.Heading>
          <Stack spacing="6">
            <FormControl>
              <FormLabel>Email or username</FormLabel>
              <Input placeholder="email@example.com" />
            </FormControl>
            <FormControl>
              <Checkbox defaultChecked>Send an invite email</Checkbox>
            </FormControl>
          </Stack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
