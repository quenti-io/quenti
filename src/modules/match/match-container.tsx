import { Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { MatchCard } from "../../components/match-card";
import { useMatchContext, type MatchItem } from "../../stores/use-match-store";
import { isReloaded } from "../../utils/navigation";
import { EventListener } from "./event-listener";
import MatchInfo from "./match-info";
import { MatchStartModal } from "./match-start-modal";
import { MatchSummary } from "./match-summary";

export const MatchContainer = () => {
  const reloaded = isReloaded();

  const terms = useMatchContext((state) => state.terms);
  const summary = useMatchContext((state) => state.roundSummary);
  const completed = useMatchContext((state) => state.completed);
  const setCard = useMatchContext((state) => state.setCard);
  const nextRound = useMatchContext((state) => state.nextRound);
  const requestZIndex = useMatchContext((state) => state.requestZIndex);

  const validateUnderIndices = useMatchContext(
    (state) => state.validateUnderIndices
  );

  const wrapper = React.useRef<HTMLDivElement>(null);

  const onDragStart = React.useCallback((term: MatchItem, index: number) => {
    setCard(index, {
      ...term,
      zIndex: requestZIndex(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnd = React.useCallback(
    (term: MatchItem, index: number, x: number, y: number) => {
      setCard(index, {
        ...term,
        x: term.x + x,
        y: term.y + y,
      });
      return validateUnderIndices(index, wrapper.current!);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  React.useEffect(() => {
    // Start the round immediately if the user is entering on the page
    if (reloaded) nextRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloaded]);

  return (
    <Box ref={wrapper} w="100%" h="calc(100vh - 112px)" position="relative">
      {summary && <MatchSummary />}
      <MatchStartModal isOpen={completed && !reloaded && !summary} />
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
                onDragEnd={onDragEnd}
              />
            )
          )}
        </AnimatePresence>
      )}
      <EventListener wrapper={wrapper} />
      {!completed && <MatchInfo />}
    </Box>
  );
};
