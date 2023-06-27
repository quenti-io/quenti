import { Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { MatchCard } from "../../components/match-card";
import { useHistory } from "../../hooks/use-history";
import { useMatchContext, type MatchItem } from "../../stores/use-match-store";
import { EventListener } from "./event-listener";
import MatchInfo from "./match-info";
import { MatchStartModal } from "./match-start-modal";
import { MatchSummary } from "./match-summary";

export const MatchContainer = () => {
  const history = useHistory();
  const completed = useMatchContext((state) => state.completed);
  const summary = useMatchContext((state) => state.roundSummary);
  const terms = useMatchContext((s) => s.terms);
  const setCard = useMatchContext((s) => s.setCard);
  const nextRound = useMatchContext((s) => s.nextRound);

  const [reloaded, setReloaded] = React.useState<boolean | undefined>();

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

  React.useEffect(() => {
    // Start the round immediately if the page was entered directly
    const reloaded = history.length <= 1;
    setReloaded(reloaded);
    if (reloaded) nextRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
