import { AnimatePresence } from "framer-motion";
import React from "react";

import { HeadSeo } from "@quenti/components";

import { Box } from "@chakra-ui/react";

import { MatchCard } from "../../components/match-card";
import { useHistory } from "../../hooks/use-history";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { type MatchItem, useMatchContext } from "../../stores/use-match-store";
import { EventListener } from "./event-listener";
import MatchInfo from "./match-info";
import { MatchStartModal } from "./match-start-modal";
import { MatchSummary } from "./match-summary";

export const MatchContainer = () => {
  const history = useHistory();
  const { title } = useSetFolderUnison();
  const terms = useMatchContext((state) => state.terms);
  const summary = useMatchContext((state) => state.roundSummary);
  const completed = useMatchContext((state) => state.completed);
  const setCard = useMatchContext((state) => state.setCard);
  const nextRound = useMatchContext((state) => state.nextRound);
  const requestZIndex = useMatchContext((state) => state.requestZIndex);

  const [reloaded, setReloaded] = React.useState<boolean | undefined>();

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

  React.useEffect(() => {
    // Start the round immediately if the page was entered directly
    const reloaded = history.length <= 1;
    setReloaded(reloaded);
    if (reloaded) nextRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeadSeo title={`Match: ${title}`} />
      <Box ref={wrapper} w="100%" h="calc(100vh - 112px)" position="relative">
        {summary && <MatchSummary />}
        <MatchStartModal isOpen={completed && reloaded === false && !summary} />
        {!completed && (
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
        )}
        <EventListener wrapper={wrapper} />
        {!completed && <MatchInfo />}
      </Box>
    </>
  );
};
