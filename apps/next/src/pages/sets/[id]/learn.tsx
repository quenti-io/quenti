import { useSession } from "next-auth/react";
import { log } from "next-axiom";
import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";
import { CORRECT, INCORRECT } from "@quenti/lib/constants/remarks";
import { api } from "@quenti/trpc";

import { Container, Stack } from "@chakra-ui/react";

import { EditorGlobalStyles } from "../../../common/editor-global-styles";
import { LazyWrapper } from "../../../common/lazy-wrapper";
import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { useAuthedSet, useSet } from "../../../hooks/use-set";
import { getLayout } from "../../../layouts/main-layout";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { ActionBar } from "../../../modules/learn/action-bar";
import { CompletedView } from "../../../modules/learn/completed-view";
import { InteractionCard } from "../../../modules/learn/interaction-card";
import { LearnLoading } from "../../../modules/learn/learn-loading";
import { RoundSummary } from "../../../modules/learn/round-summary";
import { Titlebar } from "../../../modules/learn/titlebar";
import { TermImageLayer } from "../../../modules/term-image-layer";
import { useContainerContext } from "../../../stores/use-container-store";
import { useLearnContext } from "../../../stores/use-learn-store";

const Learn = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Learn" />
      <LazyWrapper>
        <EditorGlobalStyles />
        <TermImageLayer />
        <HydrateSetData
          disallowDirty
          withDistractors
          placeholder={
            <Container maxW="4xl" mt={{ base: 0, md: 10 }}>
              <Stack spacing="8" w="full">
                <Titlebar.Skeleton />
                <LearnLoading />
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
      </LazyWrapper>
    </AuthedPage>
  );
};

const LearnContainer = () => {
  const { id } = useSet();
  const session = useSession();
  const { container } = useAuthedSet();
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

    completeLearnRound.mutate({
      entityId: id,
    });

    log.info("learn.completeRound", {
      userId: session.data?.user?.id,
      containerId: container.id,
      summary: roundSummary,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundSummary, id]);

  React.useEffect(() => {
    if (!session.data?.user?.id) return;

    log.info("learn.identify", {
      userId: session.data?.user?.id,
      containerId: container.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data?.user?.id]);

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
