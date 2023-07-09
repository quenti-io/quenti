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
} from "@chakra-ui/react";
import { IconLink } from "@tabler/icons-react";

export interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalBg = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("gray.200", "gray.700");

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
            <Button variant="link" leftIcon={<IconLink size={18} />}>
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
