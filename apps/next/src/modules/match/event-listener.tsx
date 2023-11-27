import type { JSONContent } from "@tiptap/core";
import React from "react";

import { isRectInBounds } from "@quenti/lib/area";

import { type MatchItem, useMatchContext } from "../../stores/use-match-store";

export const EventListener: React.FC<{
  wrapper: React.RefObject<HTMLDivElement>;
}> = ({ wrapper }) => {
  const terms = useMatchContext((s) => s.terms);
  const roundQuestions = useMatchContext((s) => s.roundQuestions);
  const setTerms = useMatchContext((s) => s.setTerms);
  const setCard = useMatchContext((s) => s.setCard);
  const pickNewSpot = useMatchContext((s) => s.pickNewSpot);
  const setZIndex = useMatchContext((s) => s.setZIndex);

  const grossTerms = React.useRef<MatchItem[]>();
  grossTerms.current = terms;

  React.useEffect(() => {
    if (!wrapper.current) return;

    const terms: MatchItem[] = roundQuestions.flatMap((term, i) => {
      const base: Omit<MatchItem, "type" | "word" | "richWord" | "zIndex"> = {
        id: term.id,
        completed: false,
        assetUrl: term.assetUrl,
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
          richWord: term.wordRichText as JSONContent | null,
          zIndex: i * 2 + 1,
        },
        {
          ...base,
          type: "definition",
          word: term.definition,
          richWord: term.definitionRichText as JSONContent | null,
          zIndex: i * 2 + 2,
        },
      ];
    });

    setTerms(terms);
    setZIndex(terms.length);

    setTimeout(() => {
      terms.forEach((term, index) => {
        const width = grossTerms.current![index]!.width;
        const height = grossTerms.current![index]!.height;
        const { x, y } = pickNewSpot(
          index,
          { ...term, width, height },
          wrapper.current!,
        );

        setCard(index, {
          ...term,
          /**
           * By now, the component will have updated its own height to be correct
           * But, `term` references a completely independent object that didn't see this change.
           * We need the most recent copy of terms from useMatchContext((s) => s.terms) (see above)
           * But even that is lagging behind (snapshots or whatever). The normal
           * fix is to add `terms` to the dependency array, but terms updates
           * so much that we literally cannot do that. Introducing ✨ refs ✨:
           * https://stackoverflow.com/questions/53633698/referencing-outdated-state-in-react-useeffect-hook
           * that's why this is here and if there's some better solution please
           * see https://react.dev/learn/state-as-a-snapshot & https://react.dev/learn/referencing-values-with-refs
           *
           * I do not think this can be a race condition. I think this fixes the race condition.
           * - height updated after this runs -> final height is correct (this cond is rare, but could result in overlapping)
           * - height updated before this runs -> This sees the correct height and does not ruin it
           */
          height,
          width,
          x,
          y,
          targetX: x,
          targetY: y,
        });
      });
    });

    const resizeHandler = () => {
      grossTerms
        .current!.filter((t) => !t.completed)
        .forEach((term, index) => {
          const rect = wrapper.current!.getBoundingClientRect();
          if (!isRectInBounds(term, rect)) {
            const { x, y } = pickNewSpot(index, term, wrapper.current!);

            setCard(index, {
              ...term,
              x,
              y,
              targetX: x,
              targetY: y,
            });
          }
        });
    };

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundQuestions]);

  return <></>;
};
