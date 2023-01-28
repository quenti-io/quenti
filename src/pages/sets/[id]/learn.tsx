import { Container, Heading, Stack } from "@chakra-ui/react";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { ActionBar } from "../../../modules/learn/action-bar";
import { InteractionCard } from "../../../modules/learn/interaction-card";
import { RoundSummary } from "../../../modules/learn/round-summary";
import { useLearnContext } from "../../../stores/use-learn-store";

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

const Titlebar = () => {
  const currentRound = useLearnContext((s) => s.currentRound);

  return (
    <Heading size="lg" textAlign="center">
      Round {currentRound + 1}
    </Heading>
  );
};

const LearnContainer = () => {
  const roundSummary = useLearnContext((s) => s.roundSummary);

  if (roundSummary) return <RoundSummary />;
  return <InteractionCard />;
};

export { getServerSideProps } from "../../../components/chakra";
