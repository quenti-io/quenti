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
  const roundQuestions = useMatchContext((a) => a.roundQuestions);
  const terms = useMatchContext((s) => s.terms);
  const setTerms = useMatchContext((s) => s.setTerms);
  const setCard = useMatchContext((s) => s.setCard);
  const pickNewSpot = useMatchContext((s) =>s.pickNewSpot)

  const completed = useMatchContext((state) => state.completed);
  const validateUnderIndices = useMatchContext(
    (state) => state.validateUnderIndices
  );

  const wrapper = React.useRef<HTMLDivElement>(null);

  // See comment below
  const grossTerms = React.useRef<MatchItem[]>()
  grossTerms.current = terms

  React.useEffect(() => {
    if (!wrapper) return

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
        const { x, y } = pickNewSpot(index, wrapper.current!)

        setCard(index, {
          ...term,
          /**
           * By now, the component will have updated it's own height to be correct
           * But, `term` references a completely independent object that didn't see this change.
           * We need the most recent copy of terms from useMatchContext((s) => s.terms) (see above)
           * But even that is lagging behind (Apparently the effect only sees stuff at the point in time it was started
           * even though that's not how javascript normally works because objects are references??? but I digress).
           * Now the normal fix is to add `terms` to the dependency array
           * But terms updates so much that we literally cannot do that (run this every time it changes),
           * But we *really* want the most recent copy to get that height, just not the reruns
           * Introducing ✨ refs ✨: https://stackoverflow.com/questions/53633698/referencing-outdated-state-in-react-useeffect-hook
           * God I love react. Maybe this is all common knowledge and stuff but like
           * that's why this is here and if there's some better solution please
           * - https://react.dev/learn/state-as-a-snapshot
           * - https://react.dev/learn/referencing-values-with-refs
           *
           * I do not think this can be a race condition. I think this fixes the race condition.
           * Condition one: Card updates it's height after this runs -> Height is correct
           * Condition two: Card updates it's height before this runs -> This sees the correct height and does not ruin it
           */
          height: grossTerms.current![index]!.height,
          x,
          y,
          targetX: x,
          targetY: y,
        });
      });
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapper]);

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
