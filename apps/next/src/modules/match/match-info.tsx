import React from "react";

import { Link } from "@quenti/components";
import { outfit } from "@quenti/lib/chakra-theme";
import { api } from "@quenti/trpc";

import {
  Box,
  ButtonGroup,
  Card,
  Container,
  GridItem,
  HStack,
  IconButton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconArrowBack, IconSettings } from "@tabler/icons-react";

import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useMatchContext } from "../../stores/use-match-store";
import { formatDeciseconds } from "../../utils/time";
import { MatchSettingsModal } from "./match-settings-modal";

export interface MatchStatProps {
  value: number | string;
  label: string;
}

export const MatchStat: React.FC<MatchStatProps> = ({ value, label }) => {
  const text = useColorModeValue("gray.600", "gray.400");

  return (
    <GridItem>
      <Stat>
        <StatLabel color={text} fontWeight={700}>
          {label}
        </StatLabel>
        <StatNumber
          fontSize="4xl"
          fontFamily={outfit.style.fontFamily}
          fontWeight={800}
        >
          {value}
        </StatNumber>
      </Stat>
    </GridItem>
  );
};

const MatchInfo = () => {
  const { id } = useSetFolderUnison();
  const entityRootUrl = useEntityRootUrl();
  const startTime = useMatchContext((s) => s.roundStartTime);
  const progress = useMatchContext((s) => s.roundProgress);
  const numTerms = useMatchContext((s) => s.termsThisRound);
  const completed = useMatchContext((s) => s.completed);
  const roundSum = useMatchContext((s) => s.roundSummary);
  const isEligibleForLeaderboard = useMatchContext(
    (s) => s.isEligibleForLeaderboard,
  );

  const highscore = api.leaderboard.highscore.useQuery({
    mode: "Match",
    entityId: id,
    eligible: isEligibleForLeaderboard,
  });

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [seconds, setSeconds] = React.useState("0.0");

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() < startTime || (!roundSum && completed)) {
        setSeconds("0.0");
      } else if (completed) {
        setSeconds(() => ((roundSum!.endTime - startTime) / 1000).toFixed(1));
        clearInterval(interval);
      } else setSeconds(() => ((Date.now() - startTime) / 1000).toFixed(1));
    }, 100);

    return () => clearInterval(interval);
  }, [completed, roundSum, startTime]);

  const bg = useColorModeValue("white", "gray.750");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <>
      <MatchSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <Card
        bg={bg}
        rounded="xl"
        borderBottomWidth="3px"
        borderColor={borderColor}
        w="250px"
        ml="7"
        overflow="hidden"
      >
        <Box
          bg="orange.300"
          height="1"
          style={{
            transition: "width 0.1s ease-in-out",
            width: `calc(100% * ${progress} / ${numTerms})`,
          }}
        />
        <Container py="5" px="6">
          <Stack spacing="4">
            <HStack justifyContent="space-between" alignItems="start">
              <MatchStat label="Time" value={seconds} />
              <ButtonGroup>
                <IconButton
                  icon={<IconArrowBack />}
                  aria-label="Back"
                  variant="ghost"
                  rounded="full"
                  colorScheme="gray"
                  size="sm"
                  as={Link}
                  href={entityRootUrl}
                />
                <IconButton
                  icon={<IconSettings />}
                  aria-label="Settings"
                  variant="ghost"
                  rounded="full"
                  colorScheme="gray"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                />
              </ButtonGroup>
            </HStack>
            {highscore.data?.bestTime && (
              <MatchStat
                label="Best Time"
                value={formatDeciseconds(highscore.data.bestTime)}
              />
            )}
          </Stack>
        </Container>
      </Card>
    </>
  );
};

export default MatchInfo;
