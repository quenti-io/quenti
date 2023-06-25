import { Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { MatchCard } from "../../components/match-card";
import { useMatchContext, type MatchItem } from "../../stores/use-match-store";
import { EventListener } from "./event-listener";
import { MatchEndModal } from "./match-end-modal";
import MatchInfo from "./match-info";

export const MatchContainer = () => {
  const completed = useMatchContext((state) => state.completed);
  const terms = useMatchContext((s) => s.terms);
  const setCard = useMatchContext((s) => s.setCard);

  const validateUnderIndices = useMatchContext(
    (state) => state.validateUnderIndices
  );

  const wrapper = React.useRef<HTMLDivElement>(null);

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

  return (
    <Box ref={wrapper} w="100%" h="calc(100vh - 112px)" position="relative">
      <MatchEndModal isOpen={completed} />
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
                onDragEnd={onDragEnd}
              />
            )
          )}
        </AnimatePresence>
      )}
      <EventListener wrapper={wrapper} />
      <MatchInfo />
    </Box>
  );
};
