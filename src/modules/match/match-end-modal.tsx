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
import { IconArrowBack, IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useMatchContext } from "../../stores/use-match-store";
import Leaderboard from "../leaderboard/leaderboard";
import { GridStat } from "../learn/term-mastery";

export interface MatchEndModalProps {
  isOpen: boolean;
}

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
            <Heading>Round Complete</Heading>
            <Stack spacing={8}>
              {/*<Leaderboard/>*/}
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
                  leftIcon={<IconRefresh />}
                  variant={"solid"}
                  onClick={newRound}
                >
                  New Match
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
