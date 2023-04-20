import { Container, Stack } from "@chakra-ui/react";
import React from "react";
import { singleIdServerSideProps as getServerSideProps } from "../../../common/server-side-props";
import type { ComponentWithAuth } from "../../../components/auth-component";
import { CORRECT, INCORRECT } from "../../../constants/remarks";
import { useSet } from "../../../hooks/use-set";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { ActionBar } from "../../../modules/learn/action-bar";
import { CompletedView } from "../../../modules/learn/completed-view";
import { InteractionCard } from "../../../modules/learn/interaction-card";
import { RoundSummary } from "../../../modules/learn/round-summary";
import { Titlebar } from "../../../modules/learn/titlebar";
import { useExperienceContext } from "../../../stores/use-experience-store";
import { useLearnContext } from "../../../stores/use-learn-store";
import { api } from "../../../utils/api";

const Learn: ComponentWithAuth = () => {
  return (
    <HydrateSetData disallowDirty>
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
};

const LearnContainer = () => {
  const { id } = useSet();
  const extendedFeedbackBank = useExperienceContext(
    (s) => s.extendedFeedbackBank
  );
  const completed = useLearnContext((s) => s.completed);
  const roundSummary = useLearnContext((s) => s.roundSummary);
  const setFeedbackBank = useLearnContext((s) => s.setFeedbackBank);

  const completeLearnRound = api.experience.completeLearnRound.useMutation();
  const discoverable = api.disoverable.fetchInsults.useQuery(undefined, {
    retry: false,
    enabled: extendedFeedbackBank,
  });

  React.useEffect(() => {
    if (!roundSummary) return;

    void (async () =>
      await completeLearnRound.mutateAsync({
        studySetId: id,
      }))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundSummary, id]);

  React.useEffect(() => {
    if (!discoverable.data || !extendedFeedbackBank) return;

    const { correct, incorrect } = discoverable.data;
    setFeedbackBank(correct, incorrect);
  }, [discoverable.data, extendedFeedbackBank, setFeedbackBank]);

  React.useEffect(() => {
    if (!extendedFeedbackBank) setFeedbackBank(CORRECT, INCORRECT);
  }, [extendedFeedbackBank, setFeedbackBank]);

  if (completed) return <CompletedView />;
  if (roundSummary) return <RoundSummary />;
  return <InteractionCard />;
};

Learn.authenticationEnabled = true;

export default Learn;
export { getServerSideProps };
