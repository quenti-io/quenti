import {
  Button,
  Flex,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconArrowBack,
  IconPlayerPlay,
  IconRefresh,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useMatchContext } from "../../stores/use-match-store";
import Leaderboard from "../leaderboard/leaderboard";
import { GridStat } from "../../components/grid-stat";

export interface MatchEndModalProps {
  isOpen: boolean;
}

// TODO: <Enter> should start a new game

export const MatchEndModal: React.FC<MatchEndModalProps> = ({ isOpen }) => {
  const newRound = useMatchContext((e) => e.nextRound);
  const startTime = useMatchContext((e) => e.roundStartTime);
  const sum = useMatchContext((e) => e.roundSummary!);
  const router = useRouter();

  const statBg = useColorModeValue("gray.200", "gray.750");

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Modal isOpen={isOpen} isCentered size="xl" onClose={() => {}}>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="xl">
        <ModalBody>
          <Stack spacing={8}>
            <Heading>{sum ? "Round Complete" : "Welcome to Match!"}</Heading>
            <Stack spacing={8}>
              {/*<Leaderboard/>*/}
              {sum ? (
                <Grid gridTemplateColumns="1fr 1fr" gap={4} w="full">
                  <GridStat
                    bg={statBg}
                    label="Time"
                    value={
                      sum ? ((sum.endTime - startTime) / 1000).toFixed(1) : 0
                    }
                  />
                  <GridStat
                    bg={statBg}
                    label="Incorrect"
                    value={sum ? sum.incorrectGuesses : 0}
                  />
                </Grid>
              ) : (
                <p>Drag corresponding tiles together to clear the board</p>
              )}
              {/*TODO: There should be a gif here*/}
              <Flex gap={4}>
                <Button
                  w="full"
                  colorScheme="gray"
                  leftIcon={<IconArrowBack />}
                  variant={"outline"}
                  onClick={router.back}
                >
                  Back
                </Button>
                <Button
                  w="full"
                  leftIcon={sum ? <IconRefresh /> : <IconPlayerPlay />}
                  variant={"solid"}
                  onClick={newRound}
                >
                  {sum ? "New Match" : "Start game"}
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
