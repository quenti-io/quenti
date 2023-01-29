import { Flex, Heading, IconButton, Link } from "@chakra-ui/react";
import { IconArrowLeft, IconSettings } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";
import { useLearnContext } from "../../stores/use-learn-store";

export const Titlebar = () => {
  const { id } = useSet();
  const completed = useLearnContext((s) => s.completed);
  const currentRound = useLearnContext((s) => s.currentRound);

  return (
    <Flex alignItems="center">
      <IconButton
        icon={<IconArrowLeft />}
        aria-label="Back"
        variant="ghost"
        as={Link}
        href={`/${id}`}
      />
      <Heading size="lg" textAlign="center" flex="1">
        {completed ? "Review" : `Round ${currentRound + 1}`}
      </Heading>
      <IconButton icon={<IconSettings />} aria-label="Back" variant="ghost" />
    </Flex>
  );
};
