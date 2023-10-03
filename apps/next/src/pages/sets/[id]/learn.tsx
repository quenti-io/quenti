import React from "react";

import { HeadSeo } from "@quenti/components";
import { CORRECT, INCORRECT } from "@quenti/lib/constants/remarks";
import { api } from "@quenti/trpc";

import { Container, Skeleton, Stack } from "@chakra-ui/react";

import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { useSet } from "../../../hooks/use-set";
import { getLayout } from "../../../layouts/main-layout";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { ActionBar } from "../../../modules/learn/action-bar";
import { CompletedView } from "../../../modules/learn/completed-view";
import { InteractionCard } from "../../../modules/learn/interaction-card";
import { RoundSummary } from "../../../modules/learn/round-summary";
import { Titlebar } from "../../../modules/learn/titlebar";
import { useContainerContext } from "../../../stores/use-container-store";
import { useLearnContext } from "../../../stores/use-learn-store";

const Learn = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Learn" />
      <HydrateSetData
        disallowDirty
        withDistractors
        placeholder={
          <Container maxW="4xl" mt={{ base: 0, md: 10 }}>
            <Stack spacing="8" w="full">
              <Titlebar.Skeleton />
              <Skeleton w="full" h={{ base: 571, md: 467 }} rounded="2xl" />
            </Stack>
          </Container>
        }
      >
        <CreateLearnData>
          <Container maxW="4xl" mt={{ base: 0, md: 10 }}>
            <Stack spacing={8}>
              <Titlebar />
              <LearnContainer />
            </Stack>
          </Container>
          <ActionBar />
        </CreateLearnData>
      </HydrateSetData>
    </AuthedPage>
  );
};

const LearnContainer = () => {
  const { id } = useSet();
  const extendedFeedbackBank = useContainerContext(
    (s) => s.extendedFeedbackBank,
  );
  const completed = useLearnContext((s) => s.completed);
  const roundSummary = useLearnContext((s) => s.roundSummary);
  const setFeedbackBank = useLearnContext((s) => s.setFeedbackBank);

  const completeLearnRound = api.container.completeLearnRound.useMutation();
  const discoverable = api.disoverable.fetchInsults.useQuery(undefined, {
    enabled: extendedFeedbackBank,
  });

  React.useEffect(() => {
    if (!roundSummary) return;

    void (async () =>
      await completeLearnRound.mutateAsync({
        entityId: id,
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

Learn.PageWrapper = PageWrapper;
Learn.getLayout = getLayout;

export default Learn;
