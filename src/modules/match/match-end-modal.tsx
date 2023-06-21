import {
  Button,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { IconRefresh } from "@tabler/icons-react";
import { useMatchContext } from "../../stores/use-match-store";
import { GridStat } from "../learn/term-mastery";

export interface MatchEndModalProps {
  isOpen: boolean;
}

export const MatchEndModal: React.FC<MatchEndModalProps> = ({ isOpen }) => {
  const newRound = useMatchContext((e) => e.nextRound);
  const startTime = useMatchContext((e) => e.roundStartTime);
  const sum = useMatchContext((e) => e.roundSummary!);

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Modal isOpen={isOpen} isCentered size="xl" onClose={() => {}}>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="xl">
        <ModalBody>
          <Stack spacing={8}>
            <Heading>Round Complete</Heading>
            <Stack spacing={8}>
              <Grid gridTemplateColumns="1fr 1fr" gap={4} w="full">
                <GridStat
                  bg="gray.750"
                  label="Time"
                  value={
                    sum ? ((sum.endTime - startTime) / 1000).toFixed(1) : 0
                  }
                />
                <GridStat
                  bg="gray.750"
                  label="Incorrect"
                  value={sum ? sum.incorrectGuesses : 0}
                />
              </Grid>
              <Button
                w="full"
                leftIcon={<IconRefresh />}
                variant={"solid"}
                onClick={newRound}
              >
                New Match
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
