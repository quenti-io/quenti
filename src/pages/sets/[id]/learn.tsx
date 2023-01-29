import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import { useSet } from "../../../hooks/use-set";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { ActionBar } from "../../../modules/learn/action-bar";
import { InteractionCard } from "../../../modules/learn/interaction-card";
import { RoundSummary } from "../../../modules/learn/round-summary";
import { Titlebar } from "../../../modules/learn/titlebar";
import { useLearnContext } from "../../../stores/use-learn-store";
import { api } from "../../../utils/api";

export default function Learn() {
  return (
    <HydrateSetData>
      <CreateLearnData>
        <Container maxW="4xl">
          <Stack spacing={8}>
            <Titlebar />
            <LearnContainer />
          </Stack>
        </Container>
        <ActionBar />
      </CreateLearnData>
    </HydrateSetData>
  );
}

const LearnContainer = () => {
  const { id } = useSet();
  const roundSummary = useLearnContext((s) => s.roundSummary);

  const completeRound = api.experience.completeRound.useMutation();

  React.useEffect(() => {
    if (!roundSummary) return;

    void (async () =>
      await completeRound.mutateAsync({
        studySetId: id,
      }))();
  }, [roundSummary]);

  if (roundSummary) return <RoundSummary />;
  return <InteractionCard />;
};

export { getServerSideProps } from "../../../components/chakra";
