import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { IconRefresh } from "@tabler/icons-react";
import { useMatchContext } from "../../stores/use-match-store";

export interface MatchEndModalProps {
  isOpen: boolean;
}

export const MatchEndModal: React.FC<MatchEndModalProps> = ({ isOpen }) => {
  const newRound = useMatchContext((e) => e.nextRound);

  return (
    <Modal isOpen={isOpen} isCentered size="xl" onClose={() => {}}>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="xl">
        <ModalBody>
          <Stack spacing={6}>
            <Flex justifyContent="space-between">
              <Heading>Round Complete</Heading>
              <ModalCloseButton mr="4" mt="4" />
            </Flex>
          </Stack>
          <Button
            w="full"
            leftIcon={<IconRefresh />}
            variant={"solid"}
            onClick={newRound}
          >
            New Match
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
