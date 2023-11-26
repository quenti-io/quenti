import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components/modal";

import { Button, ButtonGroup, Stack, Text } from "@chakra-ui/react";

import { IconArrowBack, IconPlayerPlay } from "@tabler/icons-react";

import { useMatchContext } from "../../stores/use-match-store";

export interface MatchStartModalProps {
  isOpen: boolean;
}

export const MatchStartModal: React.FC<MatchStartModalProps> = ({ isOpen }) => {
  const newRound = useMatchContext((e) => e.nextRound);
  const router = useRouter();

  const removeIntro = () => {
    window.history.replaceState(null, "", router.asPath.split("?")[0]);
  };

  const actionRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => undefined}
      initialFocusRef={actionRef}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body spacing="10">
          <Stack>
            <Modal.Heading>Welcome to Match!</Modal.Heading>
            <Text>Drag corresponding tiles together to clear the board.</Text>
          </Stack>
          {/*TODO: There should be a gif here*/}
          <ButtonGroup spacing="4">
            <Button
              w="full"
              colorScheme="gray"
              leftIcon={<IconArrowBack size={18} />}
              variant="outline"
              onClick={router.back}
            >
              Back
            </Button>
            <Button
              w="full"
              leftIcon={<IconPlayerPlay size={18} />}
              variant="solid"
              onClick={() => {
                removeIntro();
                newRound();
              }}
              ref={actionRef}
            >
              Start game
            </Button>
          </ButtonGroup>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
