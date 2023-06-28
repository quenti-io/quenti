import { Button, ButtonGroup, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { IconArrowBack } from "@tabler/icons-react";
import React from "react";
import { Link } from "../../components/link";
import { Loading } from "../../components/loading";
import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { MATCH_MIN_TIME } from "../../server/api/common/constants";
import { useMatchContext } from "../../stores/use-match-store";
import { api } from "../../utils/api";
import { Leaderboard } from "../leaderboard/leaderboard";
import { MatchSummaryFeedback } from "./match-summary-feedback";

export const MatchSummary = () => {
  const { id, type } = useSetFolderUnison();
  const rootUrl = useEntityRootUrl();
  const startTime = useMatchContext((s) => s.roundStartTime);
  const summary = useMatchContext((s) => s.roundSummary)!;
  const isEligibleForLeaderboard = useMatchContext(
    (s) => s.isEligibleForLeaderboard
  );
  const elapsed = Math.floor((summary.endTime - startTime) / 100);
  const nextRound = useMatchContext((s) => s.nextRound);

  const add = api.leaderboard.add.useMutation();
  const leaderboard = api.leaderboard.byContainerId.useQuery(
    {
      mode: "Match",
      containerId: id,
    },
    {
      enabled: add.isSuccess,
    }
  );

  const isStorable = elapsed > MATCH_MIN_TIME

  React.useEffect(() => {
    if (isStorable) {
      void (async () => {
        await add.mutateAsync({
          studySetId: type === "set" ? id : undefined,
          folderId: type === "folder" ? id : undefined,
          mode: "Match",
          time: elapsed,
          eligible: isEligibleForLeaderboard,
        });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStorable]);

  const { data: highscore, isFetchedAfterMount } =
    api.leaderboard.highscore.useQuery(
      {
        mode: "Match",
        containerId: id,
        eligible: isEligibleForLeaderboard,
      },
      {
        refetchOnMount: "always",
        enabled: add.isSuccess || !isStorable,
      }
    );

  if (!summary || !leaderboard.data || !highscore || !isFetchedAfterMount)
    return <Loading />;

  return (
    <Container maxW="container.md" py="10" display="flex" alignItems="center">
      <Stack spacing="6" w="full">
        {isStorable ? <>
          <MatchSummaryFeedback
            elapsed={elapsed}
            highscore={highscore}
            highscores={leaderboard.data.highscores}
          />
          {isEligibleForLeaderboard && <Leaderboard data={leaderboard.data} />}

        </> : <>
          <Heading size={"2xl"}>Woah! You{"'"}re too fast!</Heading>
          <Text>Your time was too fast to record on our leaderboard.{
            summary.termsThisRound > 3 ? "" : " Consider playing with more terms."
          }</Text>
        </>}
        <ButtonGroup w="full" justifyContent="end">
          <Button
            variant="ghost"
            leftIcon={<IconArrowBack />}
            as={Link}
            href={rootUrl}
          >
            Back to {type === "folder" ? "folder" : "set"}
          </Button>
          <Button onClick={nextRound}>Play again</Button>
        </ButtonGroup>
      </Stack>
    </Container>
  );
};
