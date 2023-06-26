import {
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconClockPlay } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { UsernameLink } from "../../components/username-link";
import type { RouterOutputs } from "../../utils/api";
import { formatDeciseconds } from "../../utils/time";

interface MatchSummaryFeedbackProps {
  elapsed: number;
  highscores: RouterOutputs["leaderboard"]["bySetId"]["highscores"];
}

export const MatchSummaryFeedback: React.FC<MatchSummaryFeedbackProps> = ({
  elapsed,
  highscores,
}) => {
  const session = useSession();
  const selfIndex = highscores.findIndex(
    (h) => h.userId == session.data?.user?.id
  );
  const personal = highscores[selfIndex]!;
  const isPr = elapsed == personal.time;
  const successor = highscores[Math.max(selfIndex - 1, 0)]!;

  let text: React.ReactNode;

  if (!isPr) {
    text = `See if you can beat your personal record of ${formatDeciseconds(
      personal.time
    )} seconds.`;
  } else if (successor.userId != session.data?.user?.id) {
    text = (
      <>
        Now see if you can beat{" "}
        <UsernameLink username={successor.user.username} color="blue.300" />
        &apos;{!successor.user.username.toLowerCase().endsWith("s")
          ? "s"
          : ""}{" "}
        time of {formatDeciseconds(successor.time)} seconds.
      </>
    );
  } else {
    text = `You're #1!`;
  }

  const textColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Stack>
      <HStack spacing="3">
        <IconClockPlay />
        <Heading>{`${formatDeciseconds(elapsed)}s`}</Heading>
      </HStack>
      <Text color={textColor}>{text}</Text>
    </Stack>
  );
};
