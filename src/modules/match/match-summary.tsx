import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import { Loading } from "../../components/loading";
import { useSet } from "../../hooks/use-set";
import { useMatchContext } from "../../stores/use-match-store";
import { api } from "../../utils/api";
import { Leaderboard } from "./leaderboard";

export const MatchSummary = () => {
  const { id } = useSet();
  const startTime = useMatchContext((s) => s.roundStartTime);
  const summary = useMatchContext((s) => s.roundSummary);

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
      </Stack>
    </Container>
  );
};
