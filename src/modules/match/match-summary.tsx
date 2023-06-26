import { Button, ButtonGroup, Container, Stack } from "@chakra-ui/react";
import { IconArrowBack } from "@tabler/icons-react";
import React from "react";
import { Link } from "../../components/link";
import { Loading } from "../../components/loading";
import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useMatchContext } from "../../stores/use-match-store";
import { api } from "../../utils/api";
import { Leaderboard } from "../leaderboard/leaderboard";
import { MatchSummaryFeedback } from "./match-summary-feedback";

export const MatchSummary = () => {
  const { id, type } = useSetFolderUnison();
  const rootUrl = useEntityRootUrl();
  const startTime = useMatchContext((s) => s.roundStartTime);
  const summary = useMatchContext((s) => s.roundSummary)!;
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

  React.useEffect(() => {
    void (async () => {
      await add.mutateAsync({
        studySetId: type === "set" ? id : undefined,
        folderId: type === "folder" ? id : undefined,
        mode: "Match",
        time: elapsed,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!summary || !leaderboard.data) return <Loading />;

  return (
    <Container maxW="container.md" py="10" display="flex" alignItems="center">
      <Stack spacing="6" w="full">
        <MatchSummaryFeedback
          elapsed={elapsed}
          highscores={leaderboard.data.highscores}
        />
        <Leaderboard data={leaderboard.data} />
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
