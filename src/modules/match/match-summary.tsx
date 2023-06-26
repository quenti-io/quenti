import { Button, ButtonGroup, Container, Stack } from "@chakra-ui/react";
import { IconArrowBack } from "@tabler/icons-react";
import React from "react";
import { Link } from "../../components/link";
import { Loading } from "../../components/loading";
import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSet } from "../../hooks/use-set";
import { useMatchContext } from "../../stores/use-match-store";
import { api } from "../../utils/api";
import { Leaderboard } from "../leaderboard/leaderboard";

export const MatchSummary = () => {
  const { id } = useSet();
  const rootUrl = useEntityRootUrl();
  const startTime = useMatchContext((s) => s.roundStartTime);
  const summary = useMatchContext((s) => s.roundSummary);
  const nextRound = useMatchContext((s) => s.nextRound);

  const add = api.leaderboard.add.useMutation();
  const leaderboard = api.leaderboard.bySetId.useQuery(
    {
      mode: "Match",
      setId: id,
    },
    {
      enabled: add.isSuccess,
    }
  );

  React.useEffect(() => {
    if (!summary) return;

    void (async () => {
      await add.mutateAsync({
        studySetId: id,
        mode: "Match",
        time: Math.floor((summary.endTime - startTime) / 100),
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!summary || !leaderboard.data) return <Loading />;

  return (
    <Container
      maxW="container.md"
      h="full"
      py="10"
      display="flex"
      alignItems="center"
    >
      <Stack spacing="6" w="full">
        <Leaderboard data={leaderboard.data} />
        <ButtonGroup w="full" justifyContent="end">
          <Button
            variant="ghost"
            leftIcon={<IconArrowBack />}
            as={Link}
            href={rootUrl}
          >
            Back to set
          </Button>
          <Button onClick={nextRound}>Play again</Button>
        </ButtonGroup>
      </Stack>
    </Container>
  );
};
