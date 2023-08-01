import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconArrowBack, IconPlayerPlay } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { useMatchContext } from "../../stores/use-match-store";

export interface MatchStartModalProps {
  isOpen: boolean;
}

export const MatchStartModal: React.FC<MatchStartModalProps> = ({ isOpen }) => {
  const newRound = useMatchContext((e) => e.nextRound);
  const router = useRouter();

  const actionRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Modal
      isOpen={isOpen}
      isCentered
      size="xl"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClose={() => {}}
      initialFocusRef={actionRef}
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="xl">
        <ModalBody>
          <Stack spacing={8}>
            <Heading>Welcome to Match!</Heading>
            <Stack spacing={8}>
              <Text>Drag corresponding tiles together to clear the board.</Text>
              {/*TODO: There should be a gif here*/}
              <Flex gap={4}>
                <Button
                  w="full"
                  colorScheme="gray"
                  leftIcon={<IconArrowBack />}
                  variant="outline"
                  onClick={router.back}
                >
                  Back
                </Button>
                <Button
                  w="full"
                  leftIcon={<IconPlayerPlay />}
                  variant="solid"
                  onClick={newRound}
                  ref={actionRef}
                >
                  Start Game
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
