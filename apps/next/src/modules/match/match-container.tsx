import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { log } from "next-axiom";
import { useRouter } from "next/router";
import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";
import { api } from "@quenti/trpc";
import { MATCH_MIN_TIME } from "@quenti/trpc/server/common/constants";

import { Box } from "@chakra-ui/react";

import { Loading } from "../../components/loading";
import { MatchCard } from "../../components/match-card";
import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { type MatchItem, useMatchContext } from "../../stores/use-match-store";
import { EventListener } from "./event-listener";
import MatchInfo from "./match-info";
import { MatchStartModal } from "./match-start-modal";

export const MatchContainer = () => {
  const session = useSession();
  const router = useRouter();
  const root = useEntityRootUrl();

  const { title, id, entityType } = useSetFolderUnison();
  const intro = window.location.search.includes("intro");

  const terms = useMatchContext((state) => state.terms);
  const summary = useMatchContext((state) => state.roundSummary);
  const completed = useMatchContext((state) => state.completed);
  const startTime = useMatchContext((s) => s.roundStartTime);
  const isEligibleForLeaderboard = useMatchContext(
    (s) => s.isEligibleForLeaderboard,
  );
  const setCard = useMatchContext((state) => state.setCard);
  const nextRound = useMatchContext((state) => state.nextRound);
  const requestZIndex = useMatchContext((state) => state.requestZIndex);

  const getIndicesUnder = useMatchContext((state) => state.getIndicesUnder);
  const setHighlightedIndices = useMatchContext(
    (state) => state.setHighlightedIndices,
  );
  const validateUnderIndices = useMatchContext(
    (state) => state.validateUnderIndices,
  );

  const wrapper = React.useRef<HTMLDivElement>(null);

  const onDragStart = React.useCallback((term: MatchItem, index: number) => {
    setCard(index, {
      ...term,
      zIndex: requestZIndex(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrag = React.useCallback(
    (term: MatchItem, index: number, x: number, y: number) => {
      const updated = { ...term, x: term.x + x, y: term.y + y };
      setHighlightedIndices(getIndicesUnder(index, updated));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onDragEnd = React.useCallback(
    (term: MatchItem, index: number, x: number, y: number) => {
      setCard(index, {
        ...term,
        x: term.x + x,
        y: term.y + y,
      });
      validateUnderIndices(index, wrapper.current!);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const add = api.leaderboard.add.useMutation();

  React.useEffect(() => {
    // Start the round immediately if the page was entered directly
    if (!intro) nextRound();

    log.info("match.identify", {
      userId: session.data?.user?.id,
      entityId: id,
      type: entityType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!summary) return;

    void (async () => {
      const elapsed = Math.floor((summary.endTime - startTime) / 100);

      if (elapsed > MATCH_MIN_TIME) {
        await add.mutateAsync({
          entityId: id,
          mode: "Match",
          time: elapsed,
          eligible: isEligibleForLeaderboard,
        });
      }

      await router.push(
        `${root}/match/leaderboard?t=${elapsed}&eligible=${isEligibleForLeaderboard}`,
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary]);

  return (
    <>
      <HeadSeo title={`Match: ${title}`} />
      <Box ref={wrapper} w="100%" h="calc(100vh - 112px)" position="relative">
        <MatchStartModal isOpen={completed && intro} />
        {!completed ? (
          <AnimatePresence>
            {terms.map((term, index) =>
              term.completed ? (
                ""
              ) : (
                <MatchCard
                  term={term}
                  index={index}
                  key={index}
                  onDragStart={onDragStart}
                  onDrag={onDrag}
                  onDragEnd={onDragEnd}
                />
              ),
            )}
          </AnimatePresence>
        ) : (
          <Loading />
        )}
        <EventListener wrapper={wrapper} />
        {!completed && <MatchInfo />}
      </Box>
    </>
  );
};
