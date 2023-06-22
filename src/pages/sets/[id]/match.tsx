import { Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import React from "react";
import type { ComponentWithAuth } from "../../../components/auth-component";
import { MatchCard } from "../../../components/match-card";
import { CreateMatchData } from "../../../modules/create-match-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { MatchEndModal } from "../../../modules/match/match-end-modal";
import MatchInfo from "../../../modules/match/match-info";
import {
  type MatchItem,
  useMatchContext,
} from "../../../stores/use-match-store";

const Match: ComponentWithAuth = () => {
  return (
    <HydrateSetData>
      <CreateMatchData>
        <MatchContainer />
      </CreateMatchData>
    </HydrateSetData>
  );
};

const MatchContainer = () => {
  const roundQuestions = useMatchContext((state) => state.roundQuestions);
  const terms = useMatchContext((state) => state.terms);
  const setTerms = useMatchContext((state) => state.setTerms);
  const setCard = useMatchContext((state) => state.setCard);
  const completed = useMatchContext((state) => state.completed);
  const validateUnderIndices = useMatchContext(
    (state) => state.validateUnderIndices
  );

  const wrapper = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const terms: MatchItem[] = roundQuestions.flatMap((term) => {
      const base: Omit<MatchItem, "type" | "word"> = {
        id: term.id,
        completed: false,
        width: 200,
        height: 60,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
      };

      return [
        {
          ...base,
          type: "word",
          word: term.word,
        },
        {
          ...base,
          type: "definition",
          word: term.definition,
        },
      ];
    });

    setTerms(terms);

    setTimeout(() => {
      terms.forEach((term, index) => {
        const x = Math.random() * (wrapper.current!.clientWidth - 450) + 225;
        const y = Math.random() * (wrapper.current!.clientHeight - 200) + 100;

        setCard(index, {
          ...term,
          x,
          y,
          targetX: x,
          targetY: y,
        });
      });
    });
  }, [setCard, roundQuestions, setTerms]);

  return (
    <Box ref={wrapper} w="100%" h="calc(100vh - 112px)" position="relative">
      <MatchEndModal isOpen={completed} />
      <AnimatePresence>
        {terms.map((term, index) =>
          term.completed ? (
            ""
          ) : (
            <MatchCard
              term={term}
              index={index}
              key={index}
              onDragEnd={(term, x, y) => {
                setCard(index, {
                  ...term,
                  x: term.x + x,
                  y: term.y + y,
                });
                validateUnderIndices(index, wrapper.current!);
              }}
            />
          )
        )}
      </AnimatePresence>
      <MatchInfo />
    </Box>
  );
};

Match.authenticationEnabled = true;

export default Match;
